import { Recipe, Difficulty, DerivedRecipeData } from '../types/recipe.types';

const DIFFICULTY_BASE: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const calculateDerivedData = (recipe: Recipe): DerivedRecipeData => {
  const totalTimeMinutes = recipe.steps.reduce(
    (sum, step) => sum + step.durationMinutes,
    0
  );
  const totalIngredients = recipe.ingredients.length;
  const complexityScore = DIFFICULTY_BASE[recipe.difficulty] * recipe.steps.length;

  return {
    totalTimeMinutes,
    totalIngredients,
    complexityScore,
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

