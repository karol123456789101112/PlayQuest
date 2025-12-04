import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia } from '@mui/material';
import { useAuth } from '../security/authContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function GameRecommendations() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [personalized, setPersonalized] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [hoveredPersonalizedId, setHoveredPersonalizedId] = useState(null);
  const [hoveredTopSellingId, setHoveredTopSellingId] = useState(null);

  const [rpgGames, setRpgGames] = useState([]);
  const [hoveredRpgId, setHoveredRpgId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:8080/recommendations/logged', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      })
        .then(res => res.json())
        .then(data => setPersonalized(data))
        .catch(err => console.error(t('recommendations.loadError'), err));
    }

    fetch('http://localhost:8080/recommendations/all')
      .then(res => res.json())
      .then(data => setTopSelling(data))
      .catch(err => console.error(t('recommendations.loadError'), err));

    fetch('http://localhost:8080/recommendations/category/RPG')
        .then(res => res.json())
        .then(data => setRpgGames(data))
        .catch(err => console.error(t('recommendations.loadError'), err));

  }, [isAuthenticated, t]);

  const renderGames = (games, hoveredId, setHoveredId) => (
    <Grid container spacing={3}>
      {games.map(game => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
          <Card
            onClick={() => navigate(`/games/${game.id}`)}
            onMouseEnter={() => setHoveredId(game.id)}
            onMouseLeave={() => setHoveredId(null)}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              height: 300,
              width: 200,
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, filter 0.2s ease-in-out',
              transform: hoveredId === game.id ? 'scale(1.05)' : 'scale(1)',
              filter: hoveredId && hoveredId !== game.id ? 'brightness(60%)' : 'brightness(100%)',
              backgroundColor: '#000',
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
  );

  return (
    <Box sx={{ p: 4, mt: 4 }}>
      {isAuthenticated && (
        <>
          <Typography variant="h5" gutterBottom>{t('recommendations.forYou')}</Typography>
          {personalized.length === 0 ? (
            <Typography variant="body1">{t('recommendations.noRecommendations')}</Typography>
          ) : renderGames(personalized, hoveredPersonalizedId, setHoveredPersonalizedId)}
        </>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {isAuthenticated ? t('recommendations.topSelling') : t('recommendations.popular')}
      </Typography>

      {topSelling.length === 0 ? (
        <Typography variant="body1">{t('recommendations.noRecommendations')}</Typography>
      ) : renderGames(topSelling, hoveredTopSellingId, setHoveredTopSellingId)}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {t('recommendations.rpg')}
      </Typography>

      {rpgGames.length === 0 ? (
        <Typography variant="body1">
          {t('recommendations.noRecommendations')}
        </Typography>
      ) : (
        renderGames(rpgGames, hoveredRpgId, setHoveredRpgId)
      )}
    </Box>
  );
}
