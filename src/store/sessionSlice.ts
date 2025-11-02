import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SessionState } from '../types/recipe.types';

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<{
        recipeId: string;
        totalSteps: number;
        stepDurations: number[]; // in minutes
      }>
    ) => {
      const { recipeId, stepDurations } = action.payload;
      
      // Calculate total remaining time
      const totalRemainingSec = stepDurations.reduce(
        (sum, duration) => sum + duration * 60,
        0
      );

      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: stepDurations[0] * 60,
        overallRemainingSec: totalRemainingSec,
        lastTickTs: Date.now(),
      };
    },

    pauseSession: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (session) {
        session.isRunning = false;
        session.lastTickTs = undefined;
      }
    },

    resumeSession: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (session) {
        session.isRunning = true;
        session.lastTickTs = Date.now();
      }
    },

    tickSecond: (
      state,
      action: PayloadAction<{
        recipeId: string;
        stepDurations: number[]; // in minutes
      }>
    ) => {
      const { recipeId, stepDurations } = action.payload;
      const session = state.byRecipeId[recipeId];
      
      if (!session || !session.isRunning) return;

      const now = Date.now();
      const delta = session.lastTickTs ? Math.floor((now - session.lastTickTs) / 1000) : 1;
      
      session.stepRemainingSec = Math.max(0, session.stepRemainingSec - delta);
      session.overallRemainingSec = Math.max(0, session.overallRemainingSec - delta);
      session.lastTickTs = now;

      // Auto-advance to next step if current step is complete
      if (session.stepRemainingSec === 0 && session.currentStepIndex < stepDurations.length - 1) {
        session.currentStepIndex += 1;
        session.stepRemainingSec = stepDurations[session.currentStepIndex] * 60;
      }
    },

    stopCurrentStep: (
      state,
      action: PayloadAction<{
        recipeId: string;
        stepDurations: number[];
      }>
    ) => {
      const { recipeId, stepDurations } = action.payload;
      const session = state.byRecipeId[recipeId];
      
      if (!session) return;

      const isLastStep = session.currentStepIndex === stepDurations.length - 1;

      if (isLastStep) {
        // End session completely
        delete state.byRecipeId[recipeId];
        if (state.activeRecipeId === recipeId) {
          state.activeRecipeId = null;
        }
      } else {
        // Subtract the remaining time from overall
        session.overallRemainingSec -= session.stepRemainingSec;
        
        // Move to next step
        session.currentStepIndex += 1;
        session.stepRemainingSec = stepDurations[session.currentStepIndex] * 60;
        session.lastTickTs = Date.now();
        // Keep isRunning state as is
      }
    },

    endSession: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      delete state.byRecipeId[recipeId];
      if (state.activeRecipeId === recipeId) {
        state.activeRecipeId = null;
      }
    },
  },
});

export const {
  startSession,
  pauseSession,
  resumeSession,
  tickSecond,
  stopCurrentStep,
  endSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;

