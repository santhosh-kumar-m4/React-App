# Testing Guide - Recipe Builder + Cooking Session

## Quick Start Testing

The application comes with 3 sample recipes pre-loaded for immediate testing:
1. **Classic Pasta Carbonara** (Medium, 23 min)
2. **Simple Chocolate Cake** (Easy, 55 min) - Marked as favorite
3. **Beef Stir-Fry** (Hard, 34 min)

## Test Scenarios

### 1. Recipe List Page (`/recipes`)

**Test Filtering:**
1. Go to `/recipes`
2. Click "Filter by Difficulty" dropdown
3. Select "Easy" - should show only Chocolate Cake
4. Select "Medium" - should show Carbonara
5. Select multiple difficulties - should show all matching recipes
6. Clear filters - should show all recipes

**Test Sorting:**
1. In the "Sort by Time" dropdown, select "Shortest First"
2. Verify Carbonara (23 min) appears first
3. Select "Longest First"
4. Verify Chocolate Cake (55 min) appears first

**Test Favorite Toggle:**
1. Click the heart icon on any recipe card
2. The heart should fill/unfill
3. Refresh page - favorite state should persist

**Test Navigation:**
1. Click any recipe card
2. Should navigate to `/cook/:id`
3. Click "Create Recipe" button
4. Should navigate to `/create`

---

### 2. Recipe Builder Page (`/create`)

**Test Basic Information:**
1. Go to `/create`
2. Enter title: "Test Recipe" (min 3 chars)
3. Enter cuisine: "Test Cuisine" (optional)
4. Select difficulty: Medium

**Test Ingredients:**
1. Click "Ingredient Name" field
2. Enter "Tomatoes"
3. Enter quantity: 200
4. Select unit: "g"
5. Click "Add" button
6. Ingredient should appear in the list below
7. Add 2-3 more ingredients
8. Click delete icon on one ingredient - should remove it

**Test Steps - Cooking Type:**
1. Select "Cooking" in Step Type dropdown
2. Enter description: "Heat oil in pan"
3. Enter duration: 5 minutes
4. Set temperature: 180°C
5. Set speed: 3
6. Click "Add Step"
7. Step should appear with orange "Cooking" chip and settings displayed

**Test Steps - Instruction Type:**
1. Select "Instruction" in Step Type dropdown
2. Enter description: "Chop tomatoes"
3. Enter duration: 3 minutes
4. Open "Ingredients" dropdown
5. Select 1+ ingredients from the list
6. Click "Add Step"
7. Step should appear with blue ingredient chips

**Test Step Reordering:**
1. With 3+ steps added:
2. Click up arrow on step 2 - should move to position 1
3. Click down arrow on step 1 - should move to position 2
4. First step's up arrow should be disabled
5. Last step's down arrow should be disabled

**Test Validation:**
1. Clear title field
2. Click "Save Recipe"
3. Should see validation error: "Title must be at least 3 characters"
4. Fix title
5. Remove all ingredients
6. Click "Save Recipe"
7. Should see error: "At least one ingredient is required"
8. Add ingredient
9. Remove all steps
10. Click "Save Recipe"
11. Should see error: "At least one step is required"

**Test Save:**
1. Create valid recipe with all fields
2. Click "Save Recipe"
3. Should see success message
4. Should redirect to `/recipes` after 1 second
5. New recipe should appear in the list

---

### 3. Cooking Session Page (`/cook/:id`)

#### Initial State Testing

1. Navigate to any recipe from list
2. Should see:
   - Recipe title and difficulty chip
   - Total time display
   - Favorite toggle (functional)
   - "Ready to Start Cooking?" message
   - "Start Session" button
   - Timeline showing all steps with upcoming status

#### Starting Session

1. Click "Start Session"
2. Should immediately see:
   - "Step 1 of N" header
   - Step description
   - Circular progress timer starting to count down
   - Context chips (temperature/speed OR ingredient chips)
   - "Pause" button
   - "Stop Step" button
   - Overall progress bar at 0-1%
   - Timeline with Step 1 marked as "Current"

#### Timer Accuracy

1. Watch timer count down
2. Every second should decrease by 1
3. Circular progress should animate smoothly
4. Overall progress bar should increase gradually
5. Time format should be MM:SS (e.g., 05:00, 04:59, ...)

#### Pause/Resume

1. While timer is running, click "Pause"
2. Timer should freeze immediately
3. Note the remaining time
4. Button should change to "Resume"
5. Status chip should show "Paused"
6. Wait 5 seconds
7. Click "Resume"
8. Timer should continue from exact same time (drift-safe)
9. Button should change back to "Pause"

#### Keyboard Control

1. With session running, press Space bar
2. Timer should pause
3. Press Space bar again
4. Timer should resume
5. Should work consistently

#### Auto-Advance

**For recipes with multiple steps:**
1. Start session
2. Let Step 1 timer reach 00:00
3. Should automatically advance to Step 2
4. Step 2 timer should start immediately
5. Timeline should show Step 1 as completed (green check)
6. Step 2 should show as current
7. Overall progress should be accurate

**Quick Test (don't wait):**
1. Start session on Step 1
2. Immediately click "Stop Step"
3. Should advance to Step 2 immediately
4. Step 2 should start running

#### STOP Button Behavior - Non-Last Step

1. Start session
2. Let timer run for ~30 seconds
3. Click "Stop Step"
4. Should see alert: "Step ended"
5. Should automatically advance to next step
6. Next step should start immediately
7. Overall remaining time should decrease by current step's remaining time

#### STOP Button Behavior - Last Step

1. Navigate through all steps to reach the last one (or start session on a 1-step recipe)
2. On the final step, click "Stop Step"
3. Should see alert: "Step ended"
4. Session should end completely
5. Should return to "Ready to Start Cooking?" view
6. Mini player should disappear (if you were viewing from another tab)

#### Natural Completion

1. Start session
2. Wait for all steps to complete naturally (timer reaches 00:00 on last step)
3. Should see alert: "Recipe completed!"
4. Session should end
5. Should return to initial state

#### Overall Progress

1. Start session on a multi-step recipe
2. Watch overall progress bar
3. Should increase proportionally to total time, not step count
4. Example: If Step 1 is 10 min and Step 2 is 20 min:
   - After Step 1 completes: ~33% progress
   - After Step 2 completes: 100% progress

#### Timeline

1. During session, observe timeline:
2. Completed steps should have green checkmark icon
3. Current step should have circle icon and highlighted background
4. Upcoming steps should have empty circle and dimmed appearance
5. Each step should show duration chip

#### Context Display

**For Cooking Steps:**
- Should show temperature chip (e.g., "Temperature: 180°C")
- Should show speed chip (e.g., "Speed: 3")

**For Instruction Steps:**
- Should show ingredient chips (e.g., "Tomatoes", "Onion")
- Chips should be blue/outlined style

---

### 4. Global Mini Player

#### Visibility Testing

1. Start a cooking session on any recipe (e.g., Recipe A)
2. Navigate to `/recipes`
3. Mini player should appear in bottom-right corner
4. Should show:
   - Recipe title (truncated if long)
   - Current step (e.g., "Step 1 of 6")
   - Small circular progress with countdown
   - Running/Paused status chip
   - Pause/Resume button
   - Stop button

#### Navigation from Mini Player

1. With mini player visible on `/recipes`
2. Click anywhere on mini player (except buttons)
3. Should navigate to `/cook/:id` for that recipe
4. Mini player should disappear (you're on the active page)

#### Controls on Mini Player

1. From `/recipes` with active session:
2. Click Pause button on mini player
3. Timer should pause (verify by navigating to cooking page)
4. Return to `/recipes`
5. Click Resume button
6. Timer should resume
7. Click Stop button
8. Should see "Step ended" alert
9. Should advance to next step (or end if last step)

#### Multiple Routes

1. Start session
2. Navigate to `/recipes` - mini player visible
3. Navigate to `/create` - mini player visible
4. Navigate to `/cook/:id` (active recipe) - mini player hidden
5. Navigate to `/cook/:otherId` (different recipe) - mini player visible showing active recipe

#### Single Session Constraint

1. Start session on Recipe A
2. Mini player appears
3. Navigate to Recipe B's cooking page
4. Click "Start Session" on Recipe B
5. Should see alert: "Another recipe session is already active..."
6. Start button should be disabled
7. Must stop Recipe A first to start Recipe B

---

### 5. Persistence Testing

#### Recipe Persistence

1. Create a new recipe
2. Refresh the page (F5)
3. Recipe should still appear in list
4. Navigate away and come back - recipe persists

#### Session Non-Persistence

1. Start a cooking session
2. Let it run for a minute
3. Refresh the page (F5)
4. Session should be cleared
5. No active session or mini player
6. Recipe page shows initial "Start Session" state

#### Favorite Persistence

1. Toggle favorite on a recipe
2. Refresh page
3. Favorite state should persist

#### Filter/Sort Non-Persistence

1. Set filters and sorting
2. Refresh page
3. Filters/sorting reset to defaults (by design)

---

### 6. Edge Cases

#### Empty Recipe List

1. Clear localStorage: `localStorage.clear()` in browser console
2. Refresh page
3. Should see sample recipes loaded automatically
4. Should see message: "Start by creating your first recipe!"

#### Invalid Recipe ID

1. Navigate to `/cook/invalid-id-123`
2. Should redirect to `/recipes`

#### Zero-Duration Step (Invalid)

1. In recipe builder, try to add step with 0 duration
2. Should show validation error

#### Temperature Out of Range

1. Try to set temperature < 40 or > 200
2. Should show validation error

#### Speed Out of Range

1. Try to set speed < 1 or > 5
2. Should show validation error

#### Instruction Step Without Ingredients

1. Create instruction step
2. Don't select any ingredients
3. Try to add step
4. Should show error: "Instruction steps must have at least one ingredient"

---

### 7. Accessibility Testing

#### Keyboard Navigation

1. Use Tab to navigate through form fields
2. All interactive elements should be focusable
3. Focus indicators should be visible
4. Space bar pauses/resumes session

#### Screen Reader

1. Progress bars should have aria labels
2. Timer updates should be announced
3. Button states should be clear

#### Visual Indicators

1. Status chips clearly show state (Running/Paused)
2. Difficulty colors:
   - Easy = Green
   - Medium = Orange
   - Hard = Red
3. Step status icons:
   - Completed = Green checkmark
   - Current = Blue circle
   - Upcoming = Gray circle

---

## Performance Testing

1. Create recipe with 20+ steps
2. Start session
3. Timer should remain smooth
4. No lag in UI updates
5. No memory leaks

## Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (if available)

---

## Bug Reporting Template

If you find any issues:

```
**Issue:** [Brief description]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [etc.]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happened]
**Browser:** [Chrome/Firefox/etc.]
**Console Errors:** [Any errors in browser console]
```

---

## Success Criteria

✅ All recipe operations work (create, view, filter, sort, favorite)
✅ Timer counts down accurately (drift-safe)
✅ Auto-advance works correctly
✅ Pause/Resume preserves time
✅ STOP button advances to next step (or ends on last step)
✅ Overall progress is time-weighted
✅ Mini player appears/disappears correctly
✅ Mini player controls work
✅ Only one session can be active
✅ Recipes persist in localStorage
✅ Session state clears on refresh
✅ All validations work
✅ Keyboard shortcuts work
✅ No console errors
✅ Responsive on mobile

---

## Quick Smoke Test (5 minutes)

1. Open app → See sample recipes ✓
2. Click recipe → See cooking page ✓
3. Start session → Timer counts down ✓
4. Pause/Resume → Works correctly ✓
5. Navigate away → Mini player appears ✓
6. Click mini player → Returns to cooking page ✓
7. Stop step → Advances to next ✓
8. Create recipe → Save successfully ✓
9. Filter recipes → Shows correct results ✓
10. Refresh page → Recipes persist, session clears ✓

**All ✓? You're good to go! 🎉**

