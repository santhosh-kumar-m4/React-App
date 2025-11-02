import { Recipe } from '../types/recipe.types';

export const sampleRecipes: Recipe[] = [
  {
    id: 'sample-1',
    title: 'Classic Pasta Carbonara',
    cuisine: 'Italian',
    difficulty: 'Medium',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ingredients: [
      { id: 'ing-1', name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: 'ing-2', name: 'Pancetta', quantity: 200, unit: 'g' },
      { id: 'ing-3', name: 'Eggs', quantity: 4, unit: 'pcs' },
      { id: 'ing-4', name: 'Parmesan Cheese', quantity: 100, unit: 'g' },
      { id: 'ing-5', name: 'Black Pepper', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      {
        id: 'step-1',
        description: 'Bring a large pot of salted water to boil',
        type: 'cooking',
        durationMinutes: 3,
        cookingSettings: { temperature: 100, speed: 1 },
      },
      {
        id: 'step-2',
        description: 'Add spaghetti to boiling water',
        type: 'instruction',
        durationMinutes: 1,
        ingredientIds: ['ing-1'],
      },
      {
        id: 'step-3',
        description: 'Cook spaghetti until al dente',
        type: 'cooking',
        durationMinutes: 10,
        cookingSettings: { temperature: 100, speed: 2 },
      },
      {
        id: 'step-4',
        description: 'Fry pancetta in a large pan until crispy',
        type: 'instruction',
        durationMinutes: 5,
        ingredientIds: ['ing-2'],
      },
      {
        id: 'step-5',
        description: 'Mix eggs, parmesan, and black pepper in a bowl',
        type: 'instruction',
        durationMinutes: 2,
        ingredientIds: ['ing-3', 'ing-4', 'ing-5'],
      },
      {
        id: 'step-6',
        description: 'Combine hot pasta with pancetta, remove from heat, and quickly mix in egg mixture',
        type: 'instruction',
        durationMinutes: 2,
        ingredientIds: ['ing-1', 'ing-2', 'ing-3', 'ing-4'],
      },
    ],
  },
  {
    id: 'sample-2',
    title: 'Simple Chocolate Cake',
    cuisine: 'American',
    difficulty: 'Easy',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ingredients: [
      { id: 'ing-6', name: 'Flour', quantity: 250, unit: 'g' },
      { id: 'ing-7', name: 'Sugar', quantity: 200, unit: 'g' },
      { id: 'ing-8', name: 'Cocoa Powder', quantity: 50, unit: 'g' },
      { id: 'ing-9', name: 'Eggs', quantity: 3, unit: 'pcs' },
      { id: 'ing-10', name: 'Milk', quantity: 250, unit: 'ml' },
      { id: 'ing-11', name: 'Butter', quantity: 100, unit: 'g' },
    ],
    steps: [
      {
        id: 'step-7',
        description: 'Preheat oven',
        type: 'cooking',
        durationMinutes: 5,
        cookingSettings: { temperature: 180, speed: 1 },
      },
      {
        id: 'step-8',
        description: 'Mix dry ingredients: flour, sugar, and cocoa powder',
        type: 'instruction',
        durationMinutes: 3,
        ingredientIds: ['ing-6', 'ing-7', 'ing-8'],
      },
      {
        id: 'step-9',
        description: 'Beat eggs and add milk and melted butter',
        type: 'instruction',
        durationMinutes: 4,
        ingredientIds: ['ing-9', 'ing-10', 'ing-11'],
      },
      {
        id: 'step-10',
        description: 'Combine wet and dry ingredients until smooth',
        type: 'instruction',
        durationMinutes: 3,
        ingredientIds: ['ing-6', 'ing-7', 'ing-8', 'ing-9', 'ing-10', 'ing-11'],
      },
      {
        id: 'step-11',
        description: 'Bake in preheated oven',
        type: 'cooking',
        durationMinutes: 30,
        cookingSettings: { temperature: 180, speed: 2 },
      },
      {
        id: 'step-12',
        description: 'Cool cake before serving',
        type: 'cooking',
        durationMinutes: 10,
        cookingSettings: { temperature: 40, speed: 1 },
      },
    ],
  },
  {
    id: 'sample-3',
    title: 'Beef Stir-Fry',
    cuisine: 'Asian',
    difficulty: 'Hard',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ingredients: [
      { id: 'ing-12', name: 'Beef Strips', quantity: 500, unit: 'g' },
      { id: 'ing-13', name: 'Bell Peppers', quantity: 2, unit: 'pcs' },
      { id: 'ing-14', name: 'Onion', quantity: 1, unit: 'pcs' },
      { id: 'ing-15', name: 'Soy Sauce', quantity: 60, unit: 'ml' },
      { id: 'ing-16', name: 'Garlic', quantity: 4, unit: 'pcs' },
      { id: 'ing-17', name: 'Ginger', quantity: 20, unit: 'g' },
      { id: 'ing-18', name: 'Vegetable Oil', quantity: 30, unit: 'ml' },
    ],
    steps: [
      {
        id: 'step-13',
        description: 'Marinate beef strips with soy sauce, garlic, and ginger',
        type: 'instruction',
        durationMinutes: 15,
        ingredientIds: ['ing-12', 'ing-15', 'ing-16', 'ing-17'],
      },
      {
        id: 'step-14',
        description: 'Slice bell peppers and onion',
        type: 'instruction',
        durationMinutes: 5,
        ingredientIds: ['ing-13', 'ing-14'],
      },
      {
        id: 'step-15',
        description: 'Heat oil in wok on high heat',
        type: 'cooking',
        durationMinutes: 2,
        cookingSettings: { temperature: 200, speed: 5 },
      },
      {
        id: 'step-16',
        description: 'Stir-fry beef until browned',
        type: 'instruction',
        durationMinutes: 5,
        ingredientIds: ['ing-12', 'ing-18'],
      },
      {
        id: 'step-17',
        description: 'Add vegetables and stir-fry until tender-crisp',
        type: 'instruction',
        durationMinutes: 4,
        ingredientIds: ['ing-13', 'ing-14'],
      },
      {
        id: 'step-18',
        description: 'Add remaining marinade and cook until sauce thickens',
        type: 'cooking',
        durationMinutes: 3,
        cookingSettings: { temperature: 200, speed: 4 },
      },
    ],
  },
];

// Function to load sample recipes if localStorage is empty
export const loadSampleRecipesIfEmpty = (): void => {
  const stored = localStorage.getItem('recipes:v1');
  if (!stored || JSON.parse(stored).length === 0) {
    localStorage.setItem('recipes:v1', JSON.stringify(sampleRecipes));
  }
};

