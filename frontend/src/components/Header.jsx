import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, TextField, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { isAuthenticated, userRole, firstName, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { t, i18n } = useTranslation();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/games?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1.5, sm: 0 },
          py: { xs: 2, sm: 1 },
        }}
      >

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: '#fff', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            {t('appName')}
          </Typography>

          {isAuthenticated && (
            <Typography variant="body1" sx={{ color: '#fff', ml: 2 }}>
              {t('welcome', { name: firstName || '' })}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: { xs: '100%', sm: '50%' },
            order: { xs: 3, sm: 2 },
          }}
        >
          <TextField
            placeholder={t('searchPlaceholder')}
            variant="outlined"
            size="small"
            fullWidth
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'center', sm: 'flex-end' },
          }}
        >
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

          {userRole === 'ADMIN' && (
            <IconButton sx={{ color: '#fff' }} onClick={() => navigate('/statistics')}>
              <BarChartIcon />
            </IconButton>
          )}

          {isAuthenticated ? (
            <Button
              variant="contained"
              color="error"
              sx={{ color: '#fff' }}
              startIcon={<ExitToAppIcon />}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              {t('logout')}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ color: '#fff' }}
              startIcon={<ExitToAppIcon />}
              onClick={() => navigate('/login')}
            >
              {t('login')}
            </Button>
          )}

          <Button color="inherit" onClick={() => i18n.changeLanguage('en')}>
            EN
          </Button>
          <Button color="inherit" onClick={() => i18n.changeLanguage('pl')}>
            PL
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
