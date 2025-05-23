import React, { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress } from '@mui/material';

export default function CategorySlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Błąd podczas pobierania kategorii:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        gap: 2,
        padding: '16px',
        backgroundColor: '#1a1a1a',
      }}
    >
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name}
          clickable
          color="primary"
          variant="outlined"
          sx={{
            minWidth: '100px',
            minHeight: '50px',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        />
      ))}
    </Box>
  );
}
