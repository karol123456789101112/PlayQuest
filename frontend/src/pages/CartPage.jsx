import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, Button, Grid
} from '@mui/material';
import { useAuth } from '../security/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:8080/cart?userId=${userId}`);
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu koszyka:", error);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (gameId) => {
    try {
      await fetch(`http://localhost:8080/cart?userId=${userId}&gameId=${gameId}`, {
        method: 'DELETE'
      });

      setCart(prev => prev.filter(item => item.videogame.id !== gameId));
    } catch (error) {
      console.error("Błąd przy usuwaniu z koszyka:", error);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.videogame.price * item.quantity, 0);

  return (
    <div>
        <Header userName='userName'></Header>
        <Typography variant="h4" gutterBottom>Koszyk:</Typography>
        <Grid container spacing={2} direction="column">
          {cart.map(({ videogame, quantity }) => (
            <Grid item key={videogame.id}>
              <Card sx={{
                display: 'flex',
                height: 250,
                alignItems: 'stretch'
              }}>
                <CardMedia
                  component="img"
                  image={"/" + videogame.imageUrl}
                  alt={videogame.title}
                  sx={{
                    width: 150,
                    objectFit: 'cover',
                    height: '100%'
                  }}
                />
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flex: 1,
                  p: 2
                }}>
                  <Box>
                    <Typography variant="h6">{videogame.title}</Typography>
                    <Typography variant="body2">Ilość: {quantity}</Typography>
                    <Typography variant="body1">Cena: {videogame.price} zł</Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeFromCart(videogame.id)}
                  >
                    Usuń z koszyka
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Footer />
    </div>
  );
};

export default CartPage;
