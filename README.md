# Recipe Builder + Cooking Session App

A React + Redux Toolkit application for creating recipes and running cooking sessions with real-time timers and progress tracking.

## Features

### Recipe Management
- **Create Recipes**: Build recipes with ingredients and step-by-step instructions
- **Two Step Types**:
  - **Cooking Steps**: Include temperature (40-200°C) and speed settings (1-5)
  - **Instruction Steps**: Reference specific ingredients from your recipe
- **Recipe List**: View all recipes with filtering by difficulty and sorting by total time
- **Favorites**: Mark recipes as favorites for quick access

### Cooking Session
- **Linear Flow**: Steps execute in order with no manual navigation
- **Real-time Timer**: Drift-safe countdown for each step
- **Auto-advance**: Automatically moves to the next step when current step completes
- **Pause/Resume**: Pause and resume cooking at any time
- **Stop Function**: End the current step immediately
  - If not the last step: advances to next step
  - If last step: ends the session
- **Progress Tracking**:
  - Per-step circular progress with countdown
  - Overall linear progress bar
  - Time-weighted progress calculation

### Global Mini Player
- Visible on all routes except the active cooking page
- Shows cooking status while browsing other pages
- Quick access to pause/resume/stop
- Click to navigate back to full cooking session

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Material-UI v5** for components
- **localStorage** for recipe persistence

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
```

## Application Routes

- `/recipes` - View and manage all recipes
- `/create` - Create a new recipe
- `/cook/:id` - Start a cooking session for a specific recipe

## Recipe Structure

### Ingredients
- Name, quantity, and unit
- Referenced by instruction steps

### Steps
- **Cooking Step**: Includes cooking settings (temperature, speed)
- **Instruction Step**: Includes ingredient references
- Both have duration in minutes

### Derived Fields
- Total time (sum of all step durations)
- Total ingredients (count)
- Complexity score (difficulty × step count)

## Cooking Session Rules

1. **Single Active Session**: Only one recipe can be in a cooking session at a time
2. **Linear Flow**: No previous/next buttons - steps auto-advance
3. **Drift-Safe Timer**: Uses Date.now() deltas for accurate timing
4. **Keyboard Support**: Press Space to pause/resume
5. **Session State**: In-memory only (cleared on refresh)
6. **Recipe Persistence**: Saved in localStorage under `recipes:v1`

## Validations

### Recipe Builder
- Title: minimum 3 characters
- At least 1 ingredient required
- At least 1 step required
- Ingredient quantity: must be > 0
- Step duration: must be > 0
- Cooking steps: temperature 40-200°C, speed 1-5
- Instruction steps: must have at least 1 ingredient

## Product Behavior

### Starting a Session
- Begins at Step 1
- Timer starts immediately
- Session state created in Redux

### During Session
- Timer ticks every second with drift correction
- Progress updates in real-time
- Per-step and overall progress calculated
- Timeline shows completed/current/upcoming steps

### Ending a Session
- **Natural End**: Final step reaches 0:00
- **Manual Stop**: 
  - On any step except last: advances to next step
  - On last step: ends session completely
- Mini player hides when session ends

## Accessibility

- Progress bars expose ARIA values
- Timer announces time updates
- Keyboard navigation support
- Clear visual status indicators

## Development Notes

This project was built following professional React + TypeScript patterns:
- Typed Redux with RTK
- Custom hooks for Redux
- Component composition
- Separation of concerns
- Clean architecture

---
