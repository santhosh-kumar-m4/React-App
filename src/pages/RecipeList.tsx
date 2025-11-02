import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Add,
  Restaurant,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleFavorite } from '../store/recipesSlice';
import { Difficulty } from '../types/recipe.types';
import { calculateDerivedData, formatMinutes } from '../utils/recipeCalculations';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const RecipeList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes.recipes);

  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleDifficultyChange = (event: SelectChangeEvent<Difficulty[]>) => {
    const value = event.target.value;
    setDifficultyFilter(typeof value === 'string' ? [] : value);
  };

  const handleSortChange = (event: SelectChangeEvent<'asc' | 'desc'>) => {
    setSortOrder(event.target.value as 'asc' | 'desc');
  };

  const handleToggleFavorite = (recipeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(recipeId));
  };

  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = [...recipes];

    // Filter by difficulty
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter((recipe) =>
        difficultyFilter.includes(recipe.difficulty)
      );
    }

    // Sort by total time
    filtered.sort((a, b) => {
      const timeA = calculateDerivedData(a).totalTimeMinutes;
      const timeB = calculateDerivedData(b).totalTimeMinutes;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return filtered;
  }, [recipes, difficultyFilter, sortOrder]);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Hard':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Recipes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/create')}
        >
          Create Recipe
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Difficulty</InputLabel>
          <Select
            multiple
            value={difficultyFilter}
            onChange={handleDifficultyChange}
            input={<OutlinedInput label="Filter by Difficulty" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {DIFFICULTIES.map((difficulty) => (
              <MenuItem key={difficulty} value={difficulty}>
                {difficulty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by Time</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            label="Sort by Time"
          >
            <MenuItem value="asc">Shortest First</MenuItem>
            <MenuItem value="desc">Longest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredAndSortedRecipes.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recipes found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {recipes.length === 0
              ? 'Start by creating your first recipe!'
              : 'Try adjusting your filters'}
          </Typography>
          {recipes.length === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
            >
              Create Recipe
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3 
        }}>
          {filteredAndSortedRecipes.map((recipe) => {
            const derivedData = calculateDerivedData(recipe);
            return (
              <Box key={recipe.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate(`/cook/${recipe.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                        {recipe.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleToggleFavorite(recipe.id, e)}
                        color={recipe.isFavorite ? 'error' : 'default'}
                      >
                        {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={recipe.difficulty}
                        color={getDifficultyColor(recipe.difficulty)}
                        size="small"
                      />
                      <Chip
                        label={formatMinutes(derivedData.totalTimeMinutes)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {recipe.cuisine && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cuisine: {recipe.cuisine}
                      </Typography>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {derivedData.totalIngredients} ingredient{derivedData.totalIngredients !== 1 ? 's' : ''} · {recipe.steps.length} step{recipe.steps.length !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button size="small" fullWidth>
                      Start Cooking
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default RecipeList;

