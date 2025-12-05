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
  const urlPlatform = query.get('platform');
  const urlSearch = query.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(urlSearch);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState(
    urlCategory ? [urlCategory] : []
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    urlPlatform ? [urlPlatform] : []
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;
  const navigate = useNavigate();
  const { t } = useTranslation();

  //-------------------------------------------------------
  // Load categories & platforms once
  //-------------------------------------------------------
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [categoriesRes, platformsRes] = await Promise.all([
          fetch('http://localhost:8080/categories/all'),
          fetch('http://localhost:8080/platforms/all')
        ]);

        const [categoriesData, platformsData] = await Promise.all([
          categoriesRes.json(),
          platformsRes.json()
        ]);

        setCategories(categoriesData.map(c => c.name));
        setPlatforms(platformsData.map(p => p.name));
      } catch (e) {
        console.error("Błąd ładowania kategorii/platform:", e);
      }
    };
    fetchMeta();
  }, []);

  //-------------------------------------------------------
  // Fetch games from backend whenever filters change
  //-------------------------------------------------------
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("size", pageSize);

        if (searchTerm) params.append("search", searchTerm);
        selectedCategories.forEach(c => params.append("categories", c));
        selectedPlatforms.forEach(p => params.append("platforms", p));

        const res = await fetch(`http://localhost:8080/games/filter?${params}`);
        const data = await res.json();

        setGames(data.content);
        setTotalPages(data.totalPages);

      } catch (e) {
        console.error("Błąd pobierania gier:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedCategories, selectedPlatforms, searchTerm, currentPage]);

  //-------------------------------------------------------
  // Sync filters from URL
  //-------------------------------------------------------
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setSelectedCategories(q.get("category") ? [q.get("category")] : []);
    setSelectedPlatforms(q.get("platform") ? [q.get("platform")] : []);
    setSearchTerm(q.get("search") || "");
    setCurrentPage(0);
  }, [location.search]);

  //-------------------------------------------------------
  // Handlers
  //-------------------------------------------------------
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(0);
  };

  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
    setCurrentPage(0);
  };

  //-------------------------------------------------------
  // Component
  //-------------------------------------------------------
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
        {/* LEFT SIDEBAR */}
        <Box sx={{ flex: '0 0 25%', pr: 2, position: 'sticky', top: 100 }}>
          <Typography variant="h5" gutterBottom>{t('filters')}</Typography>

          {/* Categories */}
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

          {/* Platforms */}
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

        {/* GAMES LIST */}
        <Box sx={{ flex: '1 1 75%', backgroundColor: '#111', minHeight: '100vh', p: 4 }}>
          <Grid container spacing={3}>
            {games.map(game => (
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

          {/* PAGINATION */}
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
