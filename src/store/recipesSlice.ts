import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../types/recipe.types';
import { loadRecipes, saveRecipes } from '../utils/localStorage';

interface RecipesState {
  recipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: loadRecipes(),
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
      saveRecipes(state.recipes);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
        saveRecipes(state.recipes);
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter((r) => r.id !== action.payload);
      saveRecipes(state.recipes);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipe = state.recipes.find((r) => r.id === action.payload);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        recipe.updatedAt = new Date().toISOString();
        saveRecipes(state.recipes);
      }
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;

