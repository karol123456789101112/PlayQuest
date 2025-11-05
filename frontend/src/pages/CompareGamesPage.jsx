import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, List, ListItem, ListItemButton, ListItemText,
  CircularProgress, Table, TableBody, TableRow, TableCell
} from '@mui/material';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function CompareGamesPage() {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [firstGame, setFirstGame] = useState(null);
  const [secondGame, setSecondGame] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const searchGames = async (query, setter) => {
    if (!query.trim()) {
      setter([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/games/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setter(data.content || []);
    } catch (err) {
      console.error(t('errorWhileSearchingForGames') + ': ', err);
    }
  };

  const debouncedSearch1 = debounce((q) => searchGames(q, setResults1), 300);
  const debouncedSearch2 = debounce((q) => searchGames(q, setResults2), 300);

  useEffect(() => {
    if (firstGame && secondGame) {
      setSearchParams({
        firstId: firstGame.id,
        secondId: secondGame.id
      });
    }
  }, [firstGame, secondGame]);

  useEffect(() => {
    const firstId = searchParams.get('firstId');
    const secondId = searchParams.get('secondId');
    if (firstId && secondId) {
      fetch(`http://localhost:8080/games/compare?firstId=${firstId}&secondId=${secondId}`)
        .then(res => res.json())
        .then(data => setComparison(data))
        .catch(err => console.error(t('errorWhileTryingToLoadGamesFromURL') + ': ', err));
    }
  }, []);

  useEffect(() => {
    debouncedSearch1(query1);
  }, [query1]);

  useEffect(() => {
    debouncedSearch2(query2);
  }, [query2]);

  const handleCompare = async () => {
    if (!firstGame || !secondGame) {
      alert(t('chooseTwoGames'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/games/compare?firstId=${firstGame.id}&secondId=${secondGame.id}`
      );
      const data = await res.json();
      setComparison(data);
    } catch (err) {
      console.error(t('comparingError') + ': ', err);
    } finally {
      setLoading(false);
    }
  };

  const highlight = (a, b, type = 'higher') => {
    if (a === b) return 'inherit';
    if (type === 'higher') return a > b ? 'green' : 'red';
    if (type === 'lower') return a < b ? 'green' : 'red';
    return 'inherit';
  };

  return (
    <div>
      <Header userName='userName'></Header>
      <Box sx={{ minHeight: '100vh', maxWidth: 900, mx: 'auto', mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>{t('compareGames')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label={t('firstGame')}
              value={firstGame ? firstGame.title : query1}
              onChange={(e) => {
                setQuery1(e.target.value);
                setFirstGame(null);
              }}
              onFocus={() => results1.length === 0 && query1 && debouncedSearch1(query1)}
            />
            {results1.length > 0 && !firstGame && (
              <Paper sx={{ position: 'absolute', width: '100%', zIndex: 2, maxHeight: 200, overflowY: 'auto' }}>
                <List dense>
                  {results1.map((g) => (
                    <ListItem key={g.id} disablePadding>
                      <ListItemButton onClick={() => { setFirstGame(g); setQuery1(g.title); setResults1([]); }}>
                        <ListItemText primary={g.title} secondary={`${g.price} zł`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              label={t('secondGame')}
              value={secondGame ? secondGame.title : query2}
              onChange={(e) => {
                setQuery2(e.target.value);
                setSecondGame(null);
              }}
              onFocus={() => results2.length === 0 && query2 && debouncedSearch2(query2)}
            />
            {results2.length > 0 && !secondGame && (
              <Paper sx={{ position: 'absolute', width: '100%', zIndex: 2, maxHeight: 200, overflowY: 'auto' }}>
                <List dense>
                  {results2.map((g) => (
                    <ListItem key={g.id} disablePadding>
                      <ListItemButton onClick={() => { setSecondGame(g); setQuery2(g.title); setResults2([]); }}>
                        <ListItemText primary={g.title} secondary={`${g.price} zł`} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Button variant="contained" onClick={handleCompare}>{t('compare')}</Button>
        </Box>

        {loading && <CircularProgress />}

        {comparison && !loading && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>{t('comparisonResults')}</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>{t('title')}</TableCell>
                  <TableCell>
                    <Link
                      to={`/games/${comparison[0].id}`}
                      style={{
                        textDecoration: 'none',
                        color: '#1976d2',
                        fontWeight: 500,
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.target.style.color = '#0049a8')}
                      onMouseOut={(e) => (e.target.style.color = '#1976d2')}
                    >
                      {comparison[0].title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/games/${comparison[1].id}`}
                      style={{
                        textDecoration: 'none',
                        color: '#1976d2',
                        fontWeight: 500,
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.target.style.color = '#0049a8')}
                      onMouseOut={(e) => (e.target.style.color = '#1976d2')}
                    >
                      {comparison[1].title}
                    </Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('price')}</TableCell>
                  <TableCell sx={{ color: highlight(comparison[0].price, comparison[1].price, 'lower') }}>
                    {comparison[0].price} zł
                  </TableCell>
                  <TableCell sx={{ color: highlight(comparison[1].price, comparison[0].price, 'lower') }}>
                    {comparison[1].price} zł
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('rating')}</TableCell>
                  <TableCell sx={{ color: highlight(comparison[0].rating, comparison[1].rating, 'higher') }}>
                    {comparison[0].rating}
                  </TableCell>
                  <TableCell sx={{ color: highlight(comparison[1].rating, comparison[0].rating, 'higher') }}>
                    {comparison[1].rating}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('releaseDate')}</TableCell>
                  <TableCell>{comparison[0].releaseDate}</TableCell>
                  <TableCell>{comparison[1].releaseDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('categories.categories')}</TableCell>
                  <TableCell>{comparison[0].categories.map(cat => t(`categories.${cat}`)).join(', ')}</TableCell>
                  <TableCell>{comparison[1].categories.map(cat => t(`categories.${cat}`)).join(', ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('platforms')}</TableCell>
                  <TableCell>{comparison[0].platforms.join(', ')}</TableCell>
                  <TableCell>{comparison[1].platforms.join(', ')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
      <Footer />
    </div>
  );
}
