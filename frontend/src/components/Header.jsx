import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, AccountCircle as AccountCircleIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ userName }) {
  const { isAuthenticated, userRole } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
      if (e.key === 'Enter') {
        navigate(`/games?search=${encodeURIComponent(searchTerm)}`);
      }
    };

  const handleLogout = () => {
      logout();              // Czyści token i stan
      navigate('/login');    // Przekieruj na login
    };

  const goToHomePage = () => {
        navigate('/');
      };
  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                <Button
                    onClick={goToHomePage}// Logika wylogowania
                  >
                    PlayQuest
                  </Button>
              </Typography>
              {isAuthenticated && (
                <>
                  <Typography variant="body1" sx={{ color: '#fff', marginLeft: 2 }}>
                    Welcome
                  </Typography>
                  {userRole === 'ADMIN' && (
                    <Typography variant="body2" sx={{ color: '#ffcc00', marginLeft: 2 }}>
                      [Admin]
                    </Typography>
                  )}
                </>
              )}
            </Box>

        {/* Środkowa część - Pasek wyszukiwania */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <TextField
              placeholder="Search for games"
              variant="outlined"
              size="small"
              sx={{ width: '50%' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
        </Box>

        {/* Prawa część - przyciski */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/cart')}>
            <ShoppingCartIcon />
          </IconButton>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/profile')}>
            <AccountCircleIcon />
          </IconButton>
          <Button
            variant="contained"
            color="error"
            sx={{ marginLeft: 2, color: '#fff' }}
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}// Logika wylogowania
          >
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
