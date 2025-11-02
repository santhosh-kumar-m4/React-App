import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { store } from './store/store';
import RecipeList from './pages/RecipeList';
import RecipeBuilder from './pages/RecipeBuilder';
import CookingSession from './pages/CookingSession';
import GlobalMiniPlayer from './components/GlobalMiniPlayer';
import { loadSampleRecipesIfEmpty } from './utils/sampleRecipes';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Restaurant sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Recipe Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/recipes')}
            sx={{
              fontWeight: location.pathname === '/recipes' ? 'bold' : 'normal',
              textDecoration: location.pathname === '/recipes' ? 'underline' : 'none',
            }}
          >
            Recipes
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/create')}
            sx={{
              fontWeight: location.pathname === '/create' ? 'bold' : 'normal',
              textDecoration: location.pathname === '/create' ? 'underline' : 'none',
            }}
          >
            Create
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" replace />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/create" element={<RecipeBuilder />} />
        <Route path="/cook/:id" element={<CookingSession />} />
      </Routes>
      <GlobalMiniPlayer />
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Load sample recipes if localStorage is empty
    loadSampleRecipesIfEmpty();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

