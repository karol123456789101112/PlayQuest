import React, { useEffect, useState } from 'react';
import { Box, Card, CardMedia, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function GameSlider() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('http://localhost:8080/games/limited');
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error('Error while downloading games:', err);
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
    <Box sx={{ backgroundColor: '#000', p: 2 }}>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'white', mb: 2 }}
      >
        {t('recommendations.bestRated')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 2,
          paddingY: '16px',
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Card
              sx={{
                minWidth: 200,
                height: 300,
                flexShrink: 0,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.03)' },
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
          </Link>
        ))}
      </Box>
    </Box>
  );

}
