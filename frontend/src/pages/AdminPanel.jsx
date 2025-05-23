import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import AddCategoryForm from '../components/AddCategoryForm';
import AddPlatformForm from '../components/AddPlatformForm';
import AddGameForm from '../components/AddGameForm';
import GameListAdmin from '../components/GameListAdmin';
import CategoryListAdmin from '../components/CategoryListAdmin';
import PlatformListAdmin from '../components/PlatformListAdmin';
import UserListAdmin from '../components/UserListAdmin';

export default function AdminPanel() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Add New Category</Typography>
        <AddCategoryForm />
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Add New Platform</Typography>
        <AddPlatformForm />
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">Add New Game</Typography>
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
    </Box>
  );
}
