import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Pause, PlayArrow, Stop } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { pauseSession, resumeSession, stopCurrentStep } from '../store/sessionSlice';
import { formatTime } from '../utils/recipeCalculations';

const GlobalMiniPlayer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const activeRecipeId = useAppSelector((state) => state.session.activeRecipeId);
  const session = useAppSelector((state) =>
    activeRecipeId ? state.session.byRecipeId[activeRecipeId] : undefined
  );
  const recipe = useAppSelector((state) =>
    state.recipes.recipes.find((r) => r.id === activeRecipeId)
  );

  // Hide on the active cooking page
  const isOnActiveCookingPage = location.pathname === `/cook/${activeRecipeId}`;

  // Don't show if no active session or on the active cooking page
  if (!activeRecipeId || !session || !recipe || isOnActiveCookingPage) {
    return null;
  }

  const currentStep = recipe.steps[session.currentStepIndex];
  const stepDurationSec = currentStep.durationMinutes * 60;
  const stepElapsedSec = Math.max(0, stepDurationSec - session.stepRemainingSec);
  const stepProgressPercent = Math.round((stepElapsedSec / stepDurationSec) * 100);

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(pauseSession(activeRecipeId));
  };

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(resumeSession(activeRecipeId));
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const stepDurations = recipe.steps.map((s) => s.durationMinutes);
    dispatch(stopCurrentStep({ recipeId: activeRecipeId, stepDurations }));
    alert('Step ended');
  };

  const handleClick = () => {
    navigate(`/cook/${activeRecipeId}`);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 350,
        p: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        zIndex: 1300,
      }}
      onClick={handleClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Circular Progress */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={stepProgressPercent}
            size={50}
            thickness={4}
            color={session.isRunning ? 'primary' : 'inherit'}
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
            <Typography variant="caption" component="div" color="text.secondary" fontSize={10}>
              {formatTime(session.stepRemainingSec)}
            </Typography>
          </Box>
        </Box>

        {/* Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 'bold' }}
          >
            {recipe.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Step {session.currentStepIndex + 1} of {recipe.steps.length}
          </Typography>
          <Chip
            label={session.isRunning ? 'Running' : 'Paused'}
            size="small"
            color={session.isRunning ? 'success' : 'default'}
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {session.isRunning ? (
            <IconButton size="small" onClick={handlePause} color="primary">
              <Pause />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={handleResume} color="primary">
              <PlayArrow />
            </IconButton>
          )}
          <IconButton size="small" onClick={handleStop} color="error">
            <Stop />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default GlobalMiniPlayer;

