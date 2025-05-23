import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, TextField, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ userName }) {
  const { isAuthenticated, userRole, firstName, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/games?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Lewa strona - logo i rola */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/')}>
            PlayQuest
          </Typography>
          {isAuthenticated && (
            <>
              <Typography variant="body1" sx={{ color: '#fff', ml: 2 }}>
                Welcome{firstName ? `, ${firstName}` : ''}
              </Typography>
            </>
          )}
        </Box>

        {/* Środek - pasek wyszukiwania */}
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

        {/* Prawa strona - ikony i wylogowanie */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/cart')}>
            <ShoppingCartIcon />
          </IconButton>
          {isAuthenticated && (
          <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/profile')}>
            <AccountCircleIcon />
          </IconButton>
          )}
          {userRole === 'ADMIN' && (
            <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/admin')}>
              <SettingsIcon />
            </IconButton>
          )}
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 2, color: '#fff' }}
              startIcon={<ExitToAppIcon />}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Log Out
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2, color: '#fff' }}
              startIcon={<ExitToAppIcon />}
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
}
