import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, useMediaQuery } from '@mui/material';
import { useAuth } from '../security/authContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function GameRecommendations() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [personalized, setPersonalized] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [rpgGames, setRpgGames] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const renderSlider = (games) => (
    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2, px: 1 }}>
      {games.map(game => (
        <Card
          key={game.id}
          onClick={() => navigate(`/games/${game.id}`)}
          sx={{
            width: 200,
            height: 300,
            flexShrink: 0,
            borderRadius: 2,
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' },
            backgroundColor: '#000',
          }}
        >
          <CardMedia
            component="img"
            image={game.imageUrl}
            alt={game.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Card>
      ))}
    </Box>
  );

  const renderGrid = (games, sectionKey) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 200px)',
        gap: 2,
      }}
    >
      {games.map(game => {
        const cardKey = `${sectionKey}-${game.id}`;
        const isHovered = hoveredCard === cardKey;
        const isDimmed = hoveredCard && !isHovered;

        return (
          <Card
            key={cardKey}
            onClick={() => navigate(`/games/${game.id}`)}
            onMouseEnter={() => setHoveredCard(cardKey)}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{
              height: 300,
              cursor: 'pointer',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, filter 0.2s',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              filter: isDimmed ? 'brightness(0.5)' : 'brightness(1)',
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
        );
      })}
    </Box>
  );

  const renderGames = (games, sectionKey) =>
    isMobile ? renderSlider(games) : renderGrid(games, sectionKey);

  return (
    <Box sx={{ p: 4, mt: 4 }}>
      {isAuthenticated && (
        <>
          <Typography variant="h5" gutterBottom>{t('recommendations.forYou')}</Typography>
          {personalized.length === 0
            ? <Typography variant="body1">{t('recommendations.noRecommendations')}</Typography>
            : renderGames(personalized, 'personalized')}
        </>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {isAuthenticated ? t('recommendations.topSelling') : t('recommendations.popular')}
      </Typography>

      {topSelling.length === 0
        ? <Typography variant="body1">{t('recommendations.noRecommendations')}</Typography>
        : renderGames(topSelling, 'topSelling')}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {t('recommendations.rpg')}
      </Typography>

      {rpgGames.length === 0
        ? <Typography variant="body1">{t('recommendations.noRecommendations')}</Typography>
        : renderGames(rpgGames, 'rpg')}
    </Box>
  );
}
