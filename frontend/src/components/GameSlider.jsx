import React, { useEffect, useState } from 'react';
import { Box, Card, CardMedia, CircularProgress } from '@mui/material';

export default function GameSlider() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:8080/games');
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error('Błąd podczas pobierania gier:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
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
        backgroundColor: '#000',
      }}
    >
      {games.map((game) => (
        <Card
          key={game.id}
          sx={{
            minWidth: 200,
            height: 300,
            flexShrink: 0,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            height="300"
            image={game.imageUrl}
            alt={game.title}
            sx={{ objectFit: 'cover' }}
          />
        </Card>
      ))}
    </Box>
  );
}
