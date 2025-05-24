import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardMedia, CardContent, Button, Grid
} from '@mui/material';
import { useAuth } from '../security/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
  const [cart, setCart] = useState([]);
  const { userId } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCart = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:8080/cart?userId=${userId}`);
          const data = await response.json();
          setCart(data.map(item => ({
            id: item.videogame.id,
            title: item.videogame.title,
            price: item.videogame.price,
            imageUrl: item.videogame.imageUrl,
            quantity: item.quantity
          })));
        } catch (error) {
          console.error("Error while downloading cart content:", error);
        }
      } else {
        // Gość
        const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
        try {
          const gameDetails = await Promise.all(
            guestCart.map(item =>
              fetch(`http://localhost:8080/games/${item.gameId}`).then(res => res.json())
            )
          );

          const combined = guestCart.map((item, i) => ({
            id: gameDetails[i].id,
            title: gameDetails[i].title,
            price: gameDetails[i].price,
            imageUrl: gameDetails[i].imageUrl,
            quantity: item.quantity
          }));

          setCart(combined);
        } catch (err) {
          console.error("Error while loading guest cart data:", err);
        }
      }
    };

    fetchCart();
  }, [userId]);

  const removeFromCart = async (gameId) => {
    if (userId) {
      // Usuń z bazy
      try {
        await fetch(`http://localhost:8080/cart?userId=${userId}&gameId=${gameId}`, {
          method: 'DELETE'
        });
        setCart(prev => prev.filter(item => item.id !== gameId));
      } catch (error) {
        console.error("Error while deleting from cart:", error);
      }
    } else {
      // Usuń z localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const updatedCart = guestCart.filter(item => item.gameId !== gameId);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      setCart(prev => prev.filter(item => item.id !== gameId));
    }
  };


  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
        <Header userName='userName'></Header>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom>
              {cart.length > 0 ? 'Cart:' : 'Cart is empty'}
            </Typography>
            <Grid container spacing={2} direction="column">
              {cart.map((item) => (
                <Grid item key={item.id}>
                  <Card sx={{ display: 'flex', height: 250, alignItems: 'stretch' }}>
                    <CardMedia
                      component="img"
                      image={"/" + item.imageUrl}
                      alt={item.title}
                      sx={{ width: 150, objectFit: 'cover', height: '100%' }}
                    />
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flex: 1,
                        p: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="body2">Ilość: {item.quantity}</Typography>
                        <Typography variant="body1">Cena: {item.price} zł</Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Delete from cart
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

            </Grid>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Total: {total.toFixed(2)} zł</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/checkout')}
                disabled={cart.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Box>

            <Footer />
    </div>
  );
};

export default CartPage;
