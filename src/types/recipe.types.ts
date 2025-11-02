export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number; // > 0
  unit: string; // 'g', 'ml', 'pcs', etc.
}

export interface CookSettings {
  temperature: number; // 40–200
  speed: number; // 1–5
}

export interface RecipeStep {
  id: string;
  description: string;
  type: 'cooking' | 'instruction';
  durationMinutes: number; // integer > 0 (both types)
  cookingSettings?: CookSettings; // REQUIRED if type='cooking'; disallowed if 'instruction'
  ingredientIds?: string[]; // REQUIRED if type='instruction'; disallowed if 'cooking'
}

export interface Recipe {
  id: string;
  title: string;
  cuisine?: string;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DerivedRecipeData {
  totalTimeMinutes: number;
  totalIngredients: number;
  complexityScore: number;
}

export interface SessionState {
  activeRecipeId: string | null;
  byRecipeId: Record<string, {
    currentStepIndex: number; // 0-based
    isRunning: boolean;
    stepRemainingSec: number; // current step remaining
    overallRemainingSec: number; // current + future
    lastTickTs?: number; // for drift-safe deltas
  }>;
}

