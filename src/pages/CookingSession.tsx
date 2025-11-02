import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  LinearProgress,
  CircularProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Favorite,
  FavoriteBorder,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleFavorite } from '../store/recipesSlice';
import {
  startSession,
  pauseSession,
  resumeSession,
  tickSecond,
  stopCurrentStep,
  endSession,
} from '../store/sessionSlice';
import { Difficulty } from '../types/recipe.types';
import { calculateDerivedData, formatTime, formatMinutes } from '../utils/recipeCalculations';

const CookingSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r.id === id)
  );
  const activeRecipeId = useAppSelector((state) => state.session.activeRecipeId);
  const session = useAppSelector((state) =>
    id ? state.session.byRecipeId[id] : undefined
  );

  const hasAnotherActiveSession = !!(activeRecipeId && activeRecipeId !== id);

  useEffect(() => {
    if (!recipe) {
      navigate('/recipes');
      return undefined;
    }

    // Timer tick
    if (session && session.isRunning && id) {
      const intervalId = setInterval(() => {
        const stepDurations = recipe.steps.map((s) => s.durationMinutes);
        dispatch(tickSecond({ recipeId: id, stepDurations }));
      }, 1000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [recipe, session, id, navigate, dispatch]);

  // Check if session ended naturally
  useEffect(() => {
    if (recipe && session) {
      const isLastStep = session.currentStepIndex === recipe.steps.length - 1;
      if (isLastStep && session.stepRemainingSec === 0 && session.isRunning) {
        // End session
        dispatch(endSession(id!));
        alert('Recipe completed!');
      }
    }
  }, [recipe, session, id, dispatch]);

  const handleStartSession = () => {
    if (!recipe || !id) return;

    if (hasAnotherActiveSession) {
      alert('Another recipe session is already active. Please stop it first.');
      return;
    }

    const stepDurations = recipe.steps.map((s) => s.durationMinutes);
    dispatch(
      startSession({
        recipeId: id,
        totalSteps: recipe.steps.length,
        stepDurations,
      })
    );
  };

  const handlePause = useCallback(() => {
    if (!id) return;
    dispatch(pauseSession(id));
  }, [id, dispatch]);

  const handleResume = useCallback(() => {
    if (!id) return;
    dispatch(resumeSession(id));
  }, [id, dispatch]);

  const handleStop = () => {
    if (!recipe || !id) return;
    const stepDurations = recipe.steps.map((s) => s.durationMinutes);
    dispatch(stopCurrentStep({ recipeId: id, stepDurations }));
    alert('Step ended');
  };

  const handleToggleFavorite = () => {
    if (!id) return;
    dispatch(toggleFavorite(id));
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'Space' && session) {
        event.preventDefault();
        if (session.isRunning) {
          handlePause();
        } else {
          handleResume();
        }
      }
    },
    [session, handlePause, handleResume]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (!recipe) {
    return null;
  }

  const derivedData = calculateDerivedData(recipe);
  const currentStep = session ? recipe.steps[session.currentStepIndex] : null;

  // Calculate progress
  let stepProgressPercent = 0;
  let overallProgressPercent = 0;

  if (session && currentStep) {
    const stepDurationSec = currentStep.durationMinutes * 60;
    const stepElapsedSec = Math.max(0, stepDurationSec - session.stepRemainingSec);
    stepProgressPercent = Math.round((stepElapsedSec / stepDurationSec) * 100);

    const totalDurationSec = derivedData.totalTimeMinutes * 60;
    const overallElapsedSec = totalDurationSec - session.overallRemainingSec;
    overallProgressPercent = Math.round((overallElapsedSec / totalDurationSec) * 100);
  }

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

  const getIngredientName = (ingredientId: string): string => {
    return recipe.ingredients.find((ing) => ing.id === ingredientId)?.name || 'Unknown';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {recipe.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
          </Box>
          <IconButton onClick={handleToggleFavorite} color={recipe.isFavorite ? 'error' : 'default'}>
            {recipe.isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </Paper>

      {/* Active Step Panel */}
      {session && currentStep ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Step {session.currentStepIndex + 1} of {recipe.steps.length}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentStep.description}
            </Typography>

            {/* Per-step circular progress */}
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={stepProgressPercent}
                size={120}
                thickness={4}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" component="div" color="text.secondary">
                  {formatTime(session.stepRemainingSec)}
                </Typography>
              </Box>
            </Box>

            {/* Context chips */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {currentStep.type === 'cooking' && currentStep.cookingSettings && (
                <>
                  <Chip
                    label={`Temperature: ${currentStep.cookingSettings.temperature}°C`}
                    color="warning"
                  />
                  <Chip
                    label={`Speed: ${currentStep.cookingSettings.speed}`}
                    color="info"
                  />
                </>
              )}
              {currentStep.type === 'instruction' && currentStep.ingredientIds && (
                <>
                  {currentStep.ingredientIds.map((ingId) => (
                    <Chip
                      key={ingId}
                      label={getIngredientName(ingId)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </>
              )}
            </Box>
          </Box>

          {/* Controls */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {session.isRunning ? (
              <Button
                variant="contained"
                startIcon={<Pause />}
                onClick={handlePause}
                size="large"
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={handleResume}
                size="large"
              >
                Resume
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={handleStop}
              color="error"
              size="large"
            >
              Stop Step
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 2 }}
            aria-live="polite"
          >
            Press Space to {session.isRunning ? 'pause' : 'resume'}
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Ready to Start Cooking?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {recipe.steps.length} steps · {formatMinutes(derivedData.totalTimeMinutes)}
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStartSession}
            size="large"
            disabled={hasAnotherActiveSession}
          >
            Start Session
          </Button>
          {hasAnotherActiveSession && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              Another recipe session is already active
            </Typography>
          )}
        </Paper>
      )}

      {/* Overall Progress */}
      {session && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Overall Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={overallProgressPercent}
            sx={{ height: 8, borderRadius: 1, mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Overall remaining: {formatTime(session.overallRemainingSec)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {overallProgressPercent}%
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Timeline */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Timeline
        </Typography>
        <List>
          {recipe.steps.map((step, index) => {
            const isCompleted = session && index < session.currentStepIndex;
            const isCurrent = session && index === session.currentStepIndex;
            const isUpcoming = !session || index > session.currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <ListItem
                  sx={{
                    bgcolor: isCurrent ? 'action.selected' : 'transparent',
                    borderRadius: 1,
                    opacity: isUpcoming ? 0.6 : 1,
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    {isCompleted ? (
                      <CheckCircle color="success" />
                    ) : isCurrent ? (
                      <RadioButtonUnchecked color="primary" />
                    ) : (
                      <RadioButtonUnchecked color="disabled" />
                    )}
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={isCurrent ? 'bold' : 'normal'}>
                        Step {index + 1}: {step.description.substring(0, 50)}
                        {step.description.length > 50 ? '...' : ''}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip label={`${step.durationMinutes} min`} size="small" />
                        <Chip
                          label={step.type === 'cooking' ? 'Cooking' : 'Instruction'}
                          size="small"
                          color={step.type === 'cooking' ? 'warning' : 'primary'}
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < recipe.steps.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
};

export default CookingSession;

