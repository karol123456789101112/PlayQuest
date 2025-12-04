import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardMedia, CircularProgress, Typography,
  FormControlLabel, Checkbox, Button
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

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

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 10;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [gamesRes, categoriesRes, platformsRes] = await Promise.all([
          fetch('http://localhost:8080/games/all'),
          fetch('http://localhost:8080/categories/all'),
          fetch('http://localhost:8080/platforms/all')
        ]);

        const [gamesData, categoriesData, platformsData] = await Promise.all([
          gamesRes.json(),
          categoriesRes.json(),
          platformsRes.json()
        ]);

        setGames(gamesData);                         // pełna lista gier
        setCategories(categoriesData.map(c => c.name));
        setPlatforms(platformsData.map(p => p.name));

      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const filtered = games.filter(game => {

      const matchesCategory =
        selectedCategories.length === 0 ||
        (game.categories || []).some(cat => selectedCategories.includes(cat));

      const matchesPlatform =
        selectedPlatforms.length === 0 ||
        (game.platforms || []).some(plat => selectedPlatforms.includes(plat));

      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesPlatform && matchesSearch;
    });

    setFilteredGames(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(0);

  }, [games, selectedCategories, selectedPlatforms, searchTerm]);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const newCat = q.get('category');
    const newPlat = q.get('platform');
    const newSearch = q.get('search')?.toLowerCase() || '';

    setSelectedCategories(newCat ? [newCat] : []);
    setSelectedPlatforms(newPlat ? [newPlat] : []);
    setSearchTerm(newSearch);
  }, [location.search]);

  const currentGames = filteredGames.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

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
        ? prev.filter(c => c !== platform)
        : [...prev, platform]
    );
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
      <Header userName="userName" />

      <Box sx={{ display: 'flex', p: 3 }}>
        <Box sx={{ flex: '0 0 25%', pr: 2, position: 'sticky', top: 100 }}>
          <Typography variant="h5" gutterBottom>{t('filters')}</Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{t('categories.categories')}</Typography>
            {categories.map(cat => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                }
                label={t(`categories.${cat}`, cat)}
              />
            ))}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Platforms</Typography>
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

        <Box sx={{ flex: '1 1 75%', backgroundColor: '#111', minHeight: '100vh', p: 4 }}>
          <Grid container spacing={3}>
            {currentGames.map(game => (
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

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              {t('previousPage')}
            </Button>

            <Typography sx={{ mx: 2, color: 'white' }}>
              {currentPage + 1} / {totalPages}
            </Typography>

            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              {t('nextPage')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Footer />
    </div>
  );
}
