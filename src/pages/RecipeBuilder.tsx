import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Chip,
  SelectChangeEvent,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Add,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Save,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../store/hooks';
import { addRecipe } from '../store/recipesSlice';
import { Difficulty, Ingredient, RecipeStep, Recipe } from '../types/recipe.types';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const UNITS = ['g', 'ml', 'pcs', 'tsp', 'tbsp', 'cup'];

const RecipeBuilder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [errors, setErrors] = useState<string[]>([]);

  // New ingredient form
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: 0,
    unit: 'g',
  });

  // New step form
  const [newStep, setNewStep] = useState({
    description: '',
    type: 'cooking' as 'cooking' | 'instruction',
    durationMinutes: 0,
    temperature: 180,
    speed: 3,
    selectedIngredientIds: [] as string[],
  });

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim()) {
      setSnackbar({ open: true, message: 'Ingredient name is required' });
      return;
    }
    if (newIngredient.quantity <= 0) {
      setSnackbar({ open: true, message: 'Quantity must be greater than 0' });
      return;
    }

    const ingredient: Ingredient = {
      id: uuidv4(),
      name: newIngredient.name.trim(),
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
    };

    setIngredients([...ingredients, ingredient]);
    setNewIngredient({ name: '', quantity: 0, unit: 'g' });
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
    // Remove from any steps that reference this ingredient
    setSteps(
      steps.map((step) => ({
        ...step,
        ingredientIds: step.ingredientIds?.filter((ingId) => ingId !== id),
      }))
    );
  };

  const handleAddStep = () => {
    if (!newStep.description.trim()) {
      setSnackbar({ open: true, message: 'Step description is required' });
      return;
    }
    if (newStep.durationMinutes <= 0) {
      setSnackbar({ open: true, message: 'Duration must be greater than 0' });
      return;
    }

    if (newStep.type === 'cooking') {
      if (newStep.temperature < 40 || newStep.temperature > 200) {
        setSnackbar({ open: true, message: 'Temperature must be between 40-200°C' });
        return;
      }
      if (newStep.speed < 1 || newStep.speed > 5) {
        setSnackbar({ open: true, message: 'Speed must be between 1-5' });
        return;
      }
    }

    if (newStep.type === 'instruction' && newStep.selectedIngredientIds.length === 0) {
      setSnackbar({ open: true, message: 'Instruction steps must have at least one ingredient' });
      return;
    }

    const step: RecipeStep = {
      id: uuidv4(),
      description: newStep.description.trim(),
      type: newStep.type,
      durationMinutes: Math.floor(newStep.durationMinutes),
      ...(newStep.type === 'cooking'
        ? {
            cookingSettings: {
              temperature: newStep.temperature,
              speed: newStep.speed,
            },
          }
        : {
            ingredientIds: newStep.selectedIngredientIds,
          }),
    };

    setSteps([...steps, step]);
    setNewStep({
      description: '',
      type: 'cooking',
      durationMinutes: 0,
      temperature: 180,
      speed: 3,
      selectedIngredientIds: [],
    });
  };

  const handleRemoveStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleMoveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
  };

  const handleMoveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    setSteps(newSteps);
  };

  const validateRecipe = (): boolean => {
    const validationErrors: string[] = [];

    if (title.trim().length < 3) {
      validationErrors.push('Title must be at least 3 characters');
    }
    if (ingredients.length === 0) {
      validationErrors.push('At least one ingredient is required');
    }
    if (steps.length === 0) {
      validationErrors.push('At least one step is required');
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSave = () => {
    if (!validateRecipe()) {
      setSnackbar({ open: true, message: 'Please fix validation errors' });
      return;
    }

    const recipe: Recipe = {
      id: uuidv4(),
      title: title.trim(),
      cuisine: cuisine.trim() || undefined,
      difficulty,
      ingredients,
      steps,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addRecipe(recipe));
    setSnackbar({ open: true, message: 'Recipe saved successfully!' });
    
    setTimeout(() => {
      navigate('/recipes');
    }, 1000);
  };

  const getIngredientName = (id: string): string => {
    return ingredients.find((ing) => ing.id === id)?.name || 'Unknown';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Recipe
      </Typography>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.map((error, index) => (
            <div key={index}>• {error}</div>
          ))}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            helperText="Minimum 3 characters"
          />
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Cuisine (optional)"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e: SelectChangeEvent) => setDifficulty(e.target.value as Difficulty)}
              >
                {DIFFICULTIES.map((diff) => (
                  <MenuItem key={diff} value={diff}>
                    {diff}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ingredients
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Ingredient Name"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            sx={{ flex: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={newIngredient.quantity || ''}
            onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ flex: 1 }}>
            <InputLabel>Unit</InputLabel>
            <Select
              value={newIngredient.unit}
              label="Unit"
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
            >
              {UNITS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleAddIngredient} startIcon={<Add />}>
            Add
          </Button>
        </Box>

        {ingredients.map((ingredient) => (
          <Box
            key={ingredient.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              mb: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
            }}
          >
            <Typography>
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleRemoveIngredient(ingredient.id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
        {ingredients.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No ingredients added yet
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Steps
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Step Type</InputLabel>
          <Select
            value={newStep.type}
            label="Step Type"
            onChange={(e: SelectChangeEvent) =>
              setNewStep({ ...newStep, type: e.target.value as 'cooking' | 'instruction' })
            }
          >
            <MenuItem value="cooking">Cooking</MenuItem>
            <MenuItem value="instruction">Instruction</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={newStep.description}
          onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Duration (minutes)"
          type="number"
          value={newStep.durationMinutes || ''}
          onChange={(e) => setNewStep({ ...newStep, durationMinutes: parseInt(e.target.value) || 0 })}
          sx={{ mb: 2 }}
        />

        {newStep.type === 'cooking' ? (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              type="number"
              value={newStep.temperature}
              onChange={(e) => setNewStep({ ...newStep, temperature: parseInt(e.target.value) || 0 })}
              helperText="40-200°C"
            />
            <TextField
              fullWidth
              label="Speed"
              type="number"
              value={newStep.speed}
              onChange={(e) => setNewStep({ ...newStep, speed: parseInt(e.target.value) || 0 })}
              helperText="1-5"
            />
          </Box>
        ) : (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Ingredients</InputLabel>
            <Select
              multiple
              value={newStep.selectedIngredientIds}
              label="Ingredients"
              onChange={(e) => {
                const value = e.target.value;
                setNewStep({
                  ...newStep,
                  selectedIngredientIds: typeof value === 'string' ? [] : value,
                });
              }}
              renderValue={(selected) =>
                selected.map((id) => getIngredientName(id)).join(', ')
              }
            >
              {ingredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="outlined"
          onClick={handleAddStep}
          startIcon={<Add />}
          fullWidth
        >
          Add Step
        </Button>

        <Divider sx={{ my: 3 }} />

        {steps.map((step, index) => (
          <Paper
            key={step.id}
            variant="outlined"
            sx={{ p: 2, mb: 2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Step {index + 1} - {step.type === 'cooking' ? 'Cooking' : 'Instruction'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {step.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Duration: {step.durationMinutes} min
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {step.type === 'cooking' && step.cookingSettings && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`${step.cookingSettings.temperature}°C`}
                        size="small"
                      />
                      <Chip
                        label={`Speed: ${step.cookingSettings.speed}`}
                        size="small"
                      />
                    </Box>
                  )}
                  {step.type === 'instruction' && step.ingredientIds && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {step.ingredientIds.map((ingId) => (
                        <Chip
                          key={ingId}
                          label={getIngredientName(ingId)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton
                  size="small"
                  onClick={() => handleMoveStepUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleMoveStepDown(index)}
                  disabled={index === steps.length - 1}
                >
                  <ArrowDownward />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveStep(step.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
        {steps.length === 0 && (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
            No steps added yet
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/recipes')}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Recipe
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default RecipeBuilder;

