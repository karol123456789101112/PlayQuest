import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardMedia, Button, Chip, CircularProgress
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../security/authContext';
import { useTranslation } from 'react-i18next';
import '../i18n';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`http://localhost:8080/games/${id}`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Error while downloading game:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  const handleCart = async (redirect = false) => {
    if (!game) return;

    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const index = guestCart.findIndex(item => item.gameId === game.id);
      const currentQuantity = index > -1 ? guestCart[index].quantity : 0;
      const desiredQuantity = currentQuantity + 1;

      if (desiredQuantity > game.stockQuantity) {
        alert(`Only ${game.stockQuantity} copies of "${game.title}" available`);
        return;
      }

      if (index > -1) guestCart[index].quantity = desiredQuantity;
      else guestCart.push({ gameId: game.id, quantity: 1 });

      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      if (redirect) navigate('/cart');
      else alert(t('addedToCart'));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId, gameId: game.id, quantity: 1 })
      });
      if (!res.ok) {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
        return;
      }
      if (redirect) navigate('/cart');
      else alert(t('addedToCart'));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (!game) return <Typography variant="h6" align="center" mt={5}>{t('gameNotFound')}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header userName="userName" />
      <Box sx={{ flex: 1, p: 4 }}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Card sx={{ width: 200, height: 300, flexShrink: 0, borderRadius: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              image={`/${game.imageUrl}`}
              alt={game.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Card>
          <Box sx={{ flex: 1, p: 2 }}>
            <Typography variant="h4">{game.title}</Typography>
            <Typography variant="subtitle1">{t('publisher')}: {game.publisher}</Typography>
            <Typography variant="body1">{t('description')}: {game.description}</Typography>
            <Typography variant="h6">{t('price')}: {game.price} zł</Typography>
            <Typography variant="body2">{t('releaseDate')}: {game.releaseDate}</Typography>
            <Typography variant="body2">{t('rating')}: {game.rating}/10</Typography>
            <Typography variant="body2">{t('inStock')}: {game.stockQuantity}</Typography>

            <Box mt={2}>
              <Typography variant="subtitle2">{t('categories.categories')}:</Typography>
              {Array.isArray(game.categories) && game.categories.map(name => (
                <Chip key={name} label={t(`categories.${name}`, name)} sx={{ mr: 1, mt: 1 }} />
              ))}
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle2">{t('platforms')}:</Typography>
              {Array.isArray(game.platforms) && game.platforms.map(name => (
                <Chip key={name} label={name} color="primary" sx={{ mr: 1, mt: 1 }} />
              ))}
            </Box>

            <Box mt={3} display="flex" gap={2} flexWrap="wrap">
              <Button variant="contained" color="primary" onClick={() => handleCart(false)}>
                {t('addToCart')}
              </Button>
              <Button variant="contained" color="success" onClick={() => handleCart(true)}>
                {t('buyNow')}
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
      <Footer sx={{ mt: 'auto' }} />
    </Box>
  );
};

export default GameDetails;
