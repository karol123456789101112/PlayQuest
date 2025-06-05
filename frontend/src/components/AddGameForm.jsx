import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Stack, MenuItem, Select,
  InputLabel, FormControl, OutlinedInput, Box,
  FormHelperText
} from '@mui/material';

export default function AddGameForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    releaseDate: '',
    publisher: '',
    rating: '',
    stockQuantity: '',
    imageUrl: '',
    categoryIds: [],
    platformIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');

  const validators = {
    title: (val) => {
      if (!val) return 'Title is required';
      if (val.length > 100) return 'Max 100 characters';
      return '';
    },
    description: (val) => {
      if (!val) return 'Description is required';
      if (val.length > 1000) return 'Max 1000 characters';
      return '';
    },
    price: (val) => {
      const price = parseFloat(val);
      if (isNaN(price)) return 'Price must be a number';
      if (price <= 0) return 'Price must be positive';
      if (price > 10000) return 'Price must be at most 10000';
      return '';
    },
    releaseDate: (val) => {
      if (!val) return 'Release date is required';
      return '';
    },
    publisher: (val) => {
      if (!val) return 'Publisher is required';
      if (val.length > 80) return 'Max 80 characters';
      return '';
    },
    rating: (val) => {
      const rating = parseFloat(val);
      if (isNaN(rating)) return 'Rating must be a number';
      if (rating < 0 || rating > 10) return 'Rating must be between 0 and 10';
      return '';
    },
    stockQuantity: (val) => {
      const qty = parseInt(val);
      if (isNaN(qty)) return 'Stock must be a number';
      if (qty < 0) return 'Must be non-negative';
      if (qty > 10000) return 'Max stock is 10000';
      return '';
    },
    categoryIds: (val) => (!val.length ? 'Select at least one category' : ''),
    platformIds: (val) => (!val.length ? 'Select at least one platform' : '')
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, platRes] = await Promise.all([
          fetch('http://localhost:8080/categories/all'),
          fetch('http://localhost:8080/platforms/all'),
        ]);
        const [catData, platData] = await Promise.all([
          catRes.json(),
          platRes.json(),
        ]);
        setCategories(catData);
        setPlatforms(platData);
      } catch (error) {
        console.error('Error while loading Categories/Platforms:', error);
      }
    };

    fetchOptions();
  }, []);

  const validateField = (name, value) => {
    const error = validators[name] ? validators[name](value) : '';
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      Object.entries(form).map(([key, val]) => [key, validators[key] ? validators[key](val) : ''])
    );
    const hasImageError = !imageFile ? 'Image is required' : '';
    setErrors(newErrors);
    setImageError(hasImageError);

    if (Object.values(newErrors).some((msg) => msg) || hasImageError) return;


    let uploadedImageUrl = '';
    if (imageFile) {
      const imageData = new FormData();
      imageData.append('file', imageFile);

      try {
        const token = localStorage.getItem('token');
        const imgRes = await fetch('http://localhost:8080/upload-image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageData,
        });

        if (imgRes.ok) {
          uploadedImageUrl = await imgRes.text();
        } else {
          alert('Could not attach the image');
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Error while uploading');
        return;
      }
    }

    const gameData = { ...form, imageUrl: uploadedImageUrl };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/games/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      });

      if (res.ok) {
        alert('Game added!');
      } else {
        const msg = await res.text();
        alert('Error:\n' + msg);
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label="Game Title" name="title" value={form.title} onChange={handleChange}
          error={!!errors.title} helperText={errors.title} required />
        <TextField label="Game Description" name="description" multiline rows={4}
          value={form.description} onChange={handleChange}
          error={!!errors.description} helperText={errors.description} required />
        <TextField label="Price (PLN)" name="price" type="number"
          value={form.price} onChange={handleChange}
          error={!!errors.price} helperText={errors.price} required />
        <TextField label="Release Date" name="releaseDate" type="date"
          value={form.releaseDate} onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.releaseDate} helperText={errors.releaseDate} required />
        <TextField label="Publisher" name="publisher" value={form.publisher} onChange={handleChange}
          error={!!errors.publisher} helperText={errors.publisher} required />
        <TextField label="Rating (0-10)" name="rating" type="number"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          value={form.rating} onChange={handleChange}
          error={!!errors.rating} helperText={errors.rating} required />
        <TextField label="Stock Quantity" name="stockQuantity" type="number"
          value={form.stockQuantity} onChange={handleChange}
          error={!!errors.stockQuantity} helperText={errors.stockQuantity} required />

        <Button variant="outlined" component="label">
          Choose image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>
        {imageError && (
          <FormHelperText error>{imageError}</FormHelperText>
        )}
        {imageFile && (
          <Box mt={1} sx={{ color: '#aaa', fontSize: 14 }}>
            Chosen file: {imageFile.name}
          </Box>
        )}

        <FormControl fullWidth error={!!errors.categoryIds}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={form.categoryIds}
            name="categoryIds"
            onChange={handleMultiChange}
            input={<OutlinedInput label="Categories" />}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryIds && <FormHelperText>{errors.categoryIds}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth error={!!errors.platformIds}>
          <InputLabel>Platforms</InputLabel>
          <Select
            multiple
            value={form.platformIds}
            name="platformIds"
            onChange={handleMultiChange}
            input={<OutlinedInput label="Platforms" />}
          >
            {platforms.map((plat) => (
              <MenuItem key={plat.id} value={plat.id}>
                {plat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.platformIds && <FormHelperText>{errors.platformIds}</FormHelperText>}
        </FormControl>

        <Box display="flex" justifyContent="center">
          <Button variant="contained" color="primary" type="submit">
            Add Game
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
