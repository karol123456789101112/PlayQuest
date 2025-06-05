import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Stack, Typography, CircularProgress, MenuItem, Select,
  FormControl, OutlinedInput, InputLabel, FormHelperText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditGamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newImageFile, setNewImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [errors, setErrors] = useState({});

  const validators = {
    title: (val) => !val ? 'Title is required' : val.length > 100 ? 'Max 100 characters' : '',
    description: (val) => !val ? 'Description is required' : val.length > 1000 ? 'Max 1000 characters' : '',
    price: (val) => {
      const p = parseFloat(val);
      return isNaN(p) ? 'Price must be a number' : p <= 0 ? 'Must be positive' : p > 10000 ? 'Max 10000' : '';
    },
    releaseDate: (val) => !val ? 'Date is required' : '',
    publisher: (val) => !val ? 'Publisher required' : val.length > 80 ? 'Max 80 characters' : '',
    rating: (val) => {
      const r = parseFloat(val);
      return isNaN(r) ? 'Must be a number' : r < 0 || r > 10 ? '0–10 only' : '';
    },
    stockQuantity: (val) => {
      const q = parseInt(val);
      return isNaN(q) ? 'Must be a number' : q < 0 ? 'Cannot be negative' : q > 10000 ? 'Max 10000' : '';
    },
    categoryIds: (val) => val.length === 0 ? 'Select at least one' : '',
    platformIds: (val) => val.length === 0 ? 'Select at least one' : ''
  };

  const validateField = (name, value) => {
    const error = validators[name] ? validators[name](value) : '';
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [gameRes, catRes, platRes] = await Promise.all([
          fetch(`http://localhost:8080/games/${id}`),
          fetch('http://localhost:8080/categories'),
          fetch('http://localhost:8080/platforms')
        ]);

        const [gameData, catData, platData] = await Promise.all([
          gameRes.json(), catRes.json(), platRes.json()
        ]);

        const categoryIds = catData.filter(c => gameData.categories.includes(c.name)).map(c => c.id);
        const platformIds = platData.filter(p => gameData.platforms.includes(p.name)).map(p => p.id);

        setGame({ ...gameData, categoryIds, platformIds });
        setCategories(catData);
        setPlatforms(platData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      Object.entries(game).map(([key, val]) => [key, validators[key] ? validators[key](val) : ''])
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(msg => msg)) return;

    let uploadedImageUrl = game.imageUrl;

    if (newImageFile) {
      const formData = new FormData();
      formData.append('file', newImageFile);

      try {
        const token = localStorage.getItem('token');
        const imgRes = await fetch('http://localhost:8080/upload-image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (imgRes.ok) {
          uploadedImageUrl = await imgRes.text();
        } else {
          alert('Could not upload image');
          return;
        }
      } catch (err) {
        alert('Image upload error');
        return;
      }
    }

    const updatedGame = { ...game, imageUrl: uploadedImageUrl };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/games/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGame),
      });

      if (res.ok) {
        alert('Game updated!');
        navigate('/admin');
      } else if (res.status === 400) {
        const errorData = await res.json();
        setErrors(errorData); // backend walidacja
      } else {
        alert('Update error');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) return <CircularProgress />;
  if (!game) return <Typography>Game not found</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit the game</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={game.title} onChange={handleChange}
            error={!!errors.title} helperText={errors.title} required />
          <TextField label="Description" name="description" value={game.description} onChange={handleChange}
            multiline rows={4} error={!!errors.description} helperText={errors.description} required />
          <TextField label="Price" name="price" type="number" value={game.price} onChange={handleChange}
            error={!!errors.price} helperText={errors.price} required />
          <TextField label="Release Date" name="releaseDate" type="date" value={game.releaseDate}
            onChange={handleChange} InputLabelProps={{ shrink: true }}
            error={!!errors.releaseDate} helperText={errors.releaseDate} required />
          <TextField label="Publisher" name="publisher" value={game.publisher} onChange={handleChange}
            error={!!errors.publisher} helperText={errors.publisher} required />
          <TextField label="Rating" name="rating" type="number" inputProps={{ min: 0, max: 10, step: 0.1 }}
            value={game.rating} onChange={handleChange} error={!!errors.rating} helperText={errors.rating} required />
          <TextField label="Stock Quantity" name="stockQuantity" type="number" value={game.stockQuantity}
            onChange={handleChange} error={!!errors.stockQuantity} helperText={errors.stockQuantity} required />

          <FormControl fullWidth error={!!errors.categoryIds}>
            <InputLabel>Categories</InputLabel>
            <Select multiple name="categoryIds" value={game.categoryIds}
              onChange={(e) => {
                setGame({ ...game, categoryIds: e.target.value });
                validateField("categoryIds", e.target.value);
              }}
              input={<OutlinedInput label="Categories" />}>
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
            {errors.categoryIds && <FormHelperText>{errors.categoryIds}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.platformIds}>
            <InputLabel>Platforms</InputLabel>
            <Select multiple name="platformIds" value={game.platformIds}
              onChange={(e) => {
                setGame({ ...game, platformIds: e.target.value });
                validateField("platformIds", e.target.value);
              }}
              input={<OutlinedInput label="Platforms" />}>
              {platforms.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
            {errors.platformIds && <FormHelperText>{errors.platformIds}</FormHelperText>}
          </FormControl>

          <Button variant="outlined" component="label">
            Change image
            <input type="file" accept="image/*" hidden onChange={(e) => setNewImageFile(e.target.files[0])} />
          </Button>

          {newImageFile && (
            <Typography variant="body2" sx={{ color: '#888' }}>
              File chosen: {newImageFile.name}
            </Typography>
          )}

          <Button type="submit" variant="contained">Save</Button>
        </Stack>
      </form>
    </Box>
  );
}
