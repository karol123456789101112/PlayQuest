import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardMedia, CircularProgress, Typography,
  FormControlLabel, Checkbox, Button
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AllGamesPage() {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlCategory = query.get('category');
  const platformFromURL = query.get('platform');
  const [searchTerm, setSearchTerm] = useState('');

  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(urlCategory ? [urlCategory] : []);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const navigate = useNavigate();

  const useQuery = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };



  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!games.length) return;
    applyFilters();
  }, [searchTerm, selectedCategories, selectedPlatforms, games]);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const newCat = q.get('category');
    const newPlat = q.get('platform');
    const newSearch = q.get('search')?.toLowerCase() || '';

    setSelectedCategories(newCat ? [newCat] : []);
    setSelectedPlatforms(newPlat ? [newPlat] : []);
    setSearchTerm(newSearch);
  }, [location.search]);

  const fetchAllData = async () => {
    try {
      const [gamesRes, categoriesRes, platformsRes] = await Promise.all([
        fetch('http://localhost:8080/games'),
        fetch('http://localhost:8080/categories'),
        fetch('http://localhost:8080/platforms')
      ]);

      const [gamesData, categoriesData, platformsData] = await Promise.all([
        gamesRes.json(),
        categoriesRes.json(),
        platformsRes.json()
      ]);

      setGames(gamesData);
      setFilteredGames(gamesData); // initial
      setCategories(categoriesData.map(c => c.name));
      setPlatforms(platformsData.map(p => p.name));
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const applyFilters = () => {
    const filtered = games.filter(game => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        (game.categories || []).some(cat => selectedCategories.includes(cat));

      const matchesPlatform =
        selectedPlatforms.length === 0 ||
        (game.platforms || []).some(plat => selectedPlatforms.includes(plat));

      const matchesSearch = game.title.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesPlatform && matchesSearch;
    });

    setFilteredGames(filtered);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Header
        userName="userName"
      />

      {/* cały layout w jednym flex-containerze */}
      <Box sx={{ display: 'flex', p: 3 }}>
        {/* Lewa kolumna – filtry */}
        <Box sx={{ flex: '0 0 25%', pr: 2, position: 'sticky', top: 100 }}>
          <Typography variant="h5" gutterBottom>Filtry</Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Kategorie</Typography>
            {categories.map(cat => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                }
                label={cat}
              />
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Platformy</Typography>
            {platforms.map(plat => (
              <FormControlLabel
                key={plat}
                control={
                  <Checkbox
                    checked={selectedPlatforms.includes(plat)}
                    onChange={() => handlePlatformChange(plat)}
                  />
                }
                label={plat}
              />
            ))}
          </Box>
        </Box>

        {/* Prawa kolumna – gry */}
        <Box sx={{ flex: '1 1 75%', backgroundColor: '#111', minHeight: '100vh', p: 4 }}>
          <Grid container spacing={3}>
            {filteredGames.map(game => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
                <Card
                  onClick={() => navigate(`/games/${game.id}`)}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    height: 300,
                    width: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': { transform: 'scale(1.03)' },
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
        </Box>
      </Box>

      <Footer />
    </div>
  );

}
