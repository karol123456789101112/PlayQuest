import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardMedia, Button, CardContent, Chip, Grid, CircularProgress
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart} from '../components/CartContext';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';


const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`http://localhost:8080/games/${id}`);
        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error while downloading game:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const addToCart = async () => {
    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const index = guestCart.findIndex(item => item.gameId === game.id);
      if (index > -1) {
        guestCart[index].quantity += 1;
      } else {
        guestCart.push({ gameId: game.id, quantity: 1 });
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      alert("Game added to a cart as a guest.");
      return;
    }

    try {
      await fetch(`http://localhost:8080/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameId: game.id,
          quantity: 1
        })
      });
      alert("Game has been added to the cart!");
    } catch (error) {
      console.error("Error while adding game to the cart:", error);
    }
  };


  const handleBuy = async () => {
    if (!userId) {
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const index = guestCart.findIndex(item => item.gameId === game.id);
      if (index > -1) {
        guestCart[index].quantity += 1;
      } else {
        guestCart.push({ gameId: game.id, quantity: 1 });
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      navigate('/cart');
      return;
    }

    try {
      await fetch(`http://localhost:8080/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          gameId: game.id,
          quantity: 1
        })
      });
      navigate('/cart');
    } catch (error) {
      console.error("Error while adding the game to the cart:", error);
    }
  };






  if (loading) {
    return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  }

  if (!game) {
    return <Typography variant="h6" align="center" mt={5}>Game was not found</Typography>;
  }

  return (
    <div>
        <Header userName='userName'></Header>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box p={4}>
          <Card sx={{ display: 'flex'}}>
            <CardMedia
              component="img"
              image={"/" + game.imageUrl}
              alt={game.title}
              sx={{ width: 300, objectFit: 'cover' }}
            />
            <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              <Typography variant="h4">{game.title}</Typography>
              <Typography variant="subtitle1" gutterBottom>Publisher: {game.publisher}</Typography>
              <Typography variant="body1" gutterBottom>Description: {game.description}</Typography>
              <Typography variant="h6">Price: {game.price} zł</Typography>
              <Typography variant="body2">Release Date: {game.releaseDate}</Typography>
              <Typography variant="body2">Rating: {game.rating}/10</Typography>
              <Typography variant="body2">In stock: {game.stockQuantity}</Typography>

              <Box mt={2}>
                <Typography variant="subtitle2">Categories:</Typography>
                {Array.isArray(game.categories) && game.categories.map(name => (
                  <Chip key={name} label={name} sx={{ mr: 1, mt: 1 }} />
                ))}
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2">Platforms:</Typography>
                {Array.isArray(game.platforms) && game.platforms.map(name => (
                  <Chip key={name} label={name} color="primary" sx={{ mr: 1, mt: 1 }} />
                ))}
              </Box>
            </Box>
          </Card>
          <Button
            variant="contained"
            color="primary"
            onClick={addToCart}
          >
            Add to cart
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleBuy}
          >
            Buy Now
          </Button>
        </Box>
        </Box>
        <Footer />
    </div>
  );
};

export default GameDetails;
