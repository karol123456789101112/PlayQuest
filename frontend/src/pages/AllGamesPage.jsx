import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, CircularProgress, Typography } from '@mui/material';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AllGamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
  }
  const query = useQuery();
  const searchTerm = query.get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:8080/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Błąd podczas pobierania gier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <div>
    <Header userName='userName'></Header>
    <Box sx={{ padding: 4, backgroundColor: '#111', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {filteredGames.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                height: 300,
                width: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
              }}
            >
              <CardMedia
                  component="img"
                  image={game.imageUrl}
                  alt={game.title}
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    <Footer />
   </div>
  );
}
