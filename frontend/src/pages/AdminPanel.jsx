import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import AddCategoryForm from '../components/AddCategoryForm';
import AddPlatformForm from '../components/AddPlatformForm';
import AddGameForm from '../components/AddGameForm';
import GameListAdmin from '../components/GameListAdmin';
import CategoryListAdmin from '../components/CategoryListAdmin';
import PlatformListAdmin from '../components/PlatformListAdmin';
import UserListAdmin from '../components/UserListAdmin';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function AdminPanel() {
  const { t, i18n } = useTranslation();

  return (
    <div>
        <Header userName='userName'></Header>
        <Box sx={{ padding: 4, minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>
            {t('adminPanel')}
          </Typography>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">{t('addNewCategory')}</Typography>
            <AddCategoryForm />
          </Paper>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6">{t('addNewPlatform')}</Typography>
            <AddPlatformForm />
          </Paper>

          <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6">{t('addNewGame')}</Typography>
              <AddGameForm />
          </Paper>

           <Paper sx={{ p: 3, mt: 4 }}>
             <GameListAdmin />
           </Paper>

           <Paper sx={{ p: 3, mt: 4 }}>
              <CategoryListAdmin />
           </Paper>

            <Paper sx={{ p: 3, mt: 4 }}>
              <PlatformListAdmin />
            </Paper>

            <Paper sx={{ p: 3, mt: 4 }}>
              <UserListAdmin />
            </Paper>
            <Footer />
          </Box>
      </div>
  );
}
