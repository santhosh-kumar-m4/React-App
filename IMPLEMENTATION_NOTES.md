# Implementation Notes - Recipe Builder + Cooking Session

## Architecture Overview

### Directory Structure
```
src/
├── types/
│   └── recipe.types.ts          # TypeScript interfaces and types
├── store/
│   ├── store.ts                 # Redux store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── recipesSlice.ts          # Recipe management slice
│   └── sessionSlice.ts          # Cooking session slice
├── pages/
│   ├── RecipeList.tsx           # /recipes route
│   ├── RecipeBuilder.tsx        # /create route
│   └── CookingSession.tsx       # /cook/:id route
├── components/
│   └── GlobalMiniPlayer.tsx     # Floating mini player
├── utils/
│   ├── localStorage.ts          # Persistence utilities
│   └── recipeCalculations.ts   # Derived field calculations
├── App.tsx                      # Main app with routing
└── index.tsx                    # Entry point
```

## Key Implementation Details

### 1. Type System
All types defined in `recipe.types.ts`:
- `Recipe`: Main recipe structure
- `Ingredient`: Recipe ingredients
- `RecipeStep`: Cooking or instruction steps with type-specific fields
- `SessionState`: Cooking session state

### 2. State Management

#### Recipes Slice
- Manages recipe CRUD operations
- Auto-persists to localStorage on every change
- Actions: addRecipe, updateRecipe, deleteRecipe, toggleFavorite

#### Session Slice
- Manages active cooking session state
- Single active session at a time
- Actions: startSession, pauseSession, resumeSession, tickSecond, stopCurrentStep, endSession

### 3. Timer Implementation

**Drift-Safe Design:**
```typescript
// Uses Date.now() deltas instead of accumulating seconds
const now = Date.now();
const delta = session.lastTickTs 
  ? Math.floor((now - session.lastTickTs) / 1000) 
  : 1;

session.stepRemainingSec = Math.max(0, session.stepRemainingSec - delta);
session.lastTickTs = now;
```

**Auto-Advance Logic:**
```typescript
// In sessionSlice tickSecond reducer
if (session.stepRemainingSec === 0 && 
    session.currentStepIndex < stepDurations.length - 1) {
  session.currentStepIndex += 1;
  session.stepRemainingSec = stepDurations[session.currentStepIndex] * 60;
}
```

### 4. Progress Calculation

**Per-Step Progress:**
```typescript
const stepDurationSec = durationMinutes * 60;
const stepElapsedSec = Math.max(0, stepDurationSec - stepRemainingSec);
const stepProgressPercent = Math.round((stepElapsedSec / stepDurationSec) * 100);
```

**Overall Progress (Time-Weighted):**
```typescript
const totalDurationSec = sum(steps.map(s => s.durationMinutes * 60));
const overallElapsedSec = totalDurationSec - overallRemainingSec;
const overallProgressPercent = Math.round((overallElapsedSec / totalDurationSec) * 100);
```

### 5. STOP Button Behavior

```typescript
// In stopCurrentStep reducer
const isLastStep = session.currentStepIndex === stepDurations.length - 1;

if (isLastStep) {
  // End session completely
  delete state.byRecipeId[recipeId];
  state.activeRecipeId = null;
} else {
  // Subtract remaining time from overall
  session.overallRemainingSec -= session.stepRemainingSec;
  // Move to next step
  session.currentStepIndex += 1;
  session.stepRemainingSec = stepDurations[session.currentStepIndex] * 60;
  // Keep isRunning state as is
}
```

### 6. Recipe Builder Validations

**Form-Level:**
- Title: minimum 3 characters
- At least 1 ingredient
- At least 1 step

**Ingredient-Level:**
- Name: required, non-empty
- Quantity: > 0

**Step-Level:**
- Description: required
- Duration: > 0 (integer)
- **Cooking steps**: temperature 40-200, speed 1-5
- **Instruction steps**: at least 1 ingredient selected

### 7. Global Mini Player

**Visibility Rules:**
```typescript
// Hidden when:
// 1. No active session exists
// 2. Currently on the active recipe's cooking page
const isOnActiveCookingPage = location.pathname === `/cook/${activeRecipeId}`;
if (!activeRecipeId || !session || !recipe || isOnActiveCookingPage) {
  return null;
}
```

**Features:**
- Shows recipe title
- Displays current step number
- Shows per-step countdown timer
- Circular progress indicator
- Pause/Resume/Stop controls
- Click to navigate to full cooking page

### 8. Derived Fields

```typescript
const DIFFICULTY_BASE = { Easy: 1, Medium: 2, Hard: 3 };

totalTimeMinutes = sum(steps.map(s => s.durationMinutes));
totalIngredients = ingredients.length;
complexityScore = DIFFICULTY_BASE[difficulty] * steps.length;
```

## User Flows

### Creating a Recipe
1. Navigate to `/create`
2. Enter title, cuisine (optional), difficulty
3. Add ingredients (name, quantity, unit)
4. Add steps:
   - Choose type (cooking/instruction)
   - Enter description and duration
   - For cooking: set temperature and speed
   - For instruction: select ingredients
5. Reorder steps using up/down arrows
6. Save recipe → redirects to `/recipes`

### Starting a Cooking Session
1. Navigate to `/recipes`
2. Click on a recipe card
3. On `/cook/:id`, click "Start Session"
4. Timer begins immediately at Step 1
5. Watch per-step circular progress
6. Use Pause/Resume as needed
7. Press Stop to end current step:
   - Not last step: advances to next
   - Last step: ends session
8. Navigate away → mini player appears

### Using Mini Player
1. Appears on all routes except active cooking page
2. Shows cooking status
3. Click to return to `/cook/:id`
4. Controls work identically to main page

## Accessibility Features

- **Keyboard Navigation**: Space bar toggles pause/resume
- **ARIA Labels**: Progress bars expose values
- **Screen Reader Support**: Timer updates announced
- **Visual Indicators**: Clear status chips and colors
- **Responsive Design**: Works on mobile and desktop

## Testing Checklist

### Recipe Management
- [x] Create recipe with all fields
- [x] Validate required fields
- [x] Reorder steps
- [x] Delete ingredients/steps
- [x] Toggle favorite
- [x] Filter by difficulty
- [x] Sort by time

### Cooking Session
- [x] Start session
- [x] Timer counts down accurately
- [x] Auto-advance to next step
- [x] Pause preserves time
- [x] Resume continues from pause
- [x] Stop on non-last step advances
- [x] Stop on last step ends session
- [x] Per-step progress accurate
- [x] Overall progress time-weighted
- [x] Timeline shows correct status
- [x] Space bar works

### Mini Player
- [x] Shows when session active
- [x] Hides on active cooking page
- [x] Shows on other routes
- [x] Controls work
- [x] Click navigates to session
- [x] Hides when session ends

### Edge Cases
- [x] Cannot start second session
- [x] Reload clears session (by design)
- [x] Recipes persist in localStorage
- [x] Malformed localStorage handled
- [x] Recipe not found redirects

## Performance Considerations

1. **Timer Optimization**: Single setInterval per session
2. **Drift Correction**: Date.now() based timing
3. **Memo Usage**: UseMemo for filtered/sorted lists
4. **Redux Efficiency**: Normalized state structure
5. **Component Splitting**: Lazy loading could be added

## Future Enhancements

- Recipe editing (currently create-only)
- Recipe deletion from UI
- Export/import recipes (JSON)
- Recipe sharing (copy link)
- Dark mode toggle
- Recipe images
- Nutritional information
- Serving size calculator
- Print-friendly recipe view
- Recipe search
- Tags and categories
- Multiple timers (prep + cook)
- Voice commands
- Notifications when step completes

## Known Limitations

1. Session state is in-memory only (lost on refresh)
2. No backend - all data local
3. No authentication/user accounts
4. No recipe editing after creation
5. Single active session constraint
6. No offline support beyond localStorage
7. No recipe validation beyond form checks

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires localStorage and modern ES2020 features.

## Code Quality

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with React rules
- **Formatting**: Consistent code style
- **Comments**: Self-documenting code
- **Error Handling**: Try-catch for localStorage
- **Type Safety**: No any types used

---

