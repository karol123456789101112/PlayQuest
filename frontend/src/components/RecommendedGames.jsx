import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, Typography, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function RecommendedGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredGameId, setHoveredGameId] = useState(null); // nowy stan
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('TOKEN:', localStorage.getItem('token'));
    fetch('http://localhost:8080/recommendations/logged', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        console.log("Dane z backendu:", data);
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Błąd wczytywania rekomendacji:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        {t('recommended.title')}
      </Typography>

      {games.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('recommended.noGames')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {games.map(game => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <Card
                onClick={() => navigate(`/games/${game.id}`)}
                onMouseEnter={() => setHoveredGameId(game.id)}
                onMouseLeave={() => setHoveredGameId(null)}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: 300,
                  width: 200,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, filter 0.2s ease-in-out',
                  transform: hoveredGameId === game.id ? 'scale(1.05)' : 'scale(1)',
                  filter: hoveredGameId && hoveredGameId !== game.id ? 'brightness(60%)' : 'brightness(100%)',
                }}
              >
                <CardMedia
                  component="img"
                  image={game.imageUrl}
                  alt={game.title}
                  sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
