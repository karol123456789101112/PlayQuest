import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Stack, MenuItem, Select,
  InputLabel, FormControl, OutlinedInput, Box,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

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
  const { t, i18n } = useTranslation();

  const validators = {
    title: (val) => {
      if (!val) return t('gameTitleReq1');
      if (val.length > 100) return t('gameTitleReq2');
      return '';
    },
    description: (val) => {
      if (!val) return t('gameDescReq1');
      if (val.length > 1000) return t('gameDescReq2');
      return '';
    },
    price: (val) => {
      const price = parseFloat(val);
      if (isNaN(price)) return t('gamePriceReq1');
      if (price <= 0) return t('gamePriceReq2');
      if (price > 10000) return t('gamePriceReq3');
      return '';
    },
    releaseDate: (val) => {
      if (!val) return t('gameReleaseDateReq1');
      return '';
    },
    publisher: (val) => {
      if (!val) return t('gamePublisherReq1');
      if (val.length > 80) return t('gamePublisherReq2');
      return '';
    },
    rating: (val) => {
      const rating = parseFloat(val);
      if (isNaN(rating)) return t('gameRatingReq1');
      if (rating < 0 || rating > 10) return t('gameRatingReq2');
      return '';
    },
    stockQuantity: (val) => {
      const qty = parseInt(val);
      if (isNaN(qty)) return t('gameStockReq1');
      if (qty < 0) return t('gameStockReq2');
      if (qty > 10000) return t('gameStockReq3');
      return '';
    },
    categoryIds: (val) => (!val.length ? t('selectAtLeastOneCategory') : ''),
    platformIds: (val) => (!val.length ? t('selectAtLeastOnePlatform') : '')
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
        console.error(t('errorWhileUploadingCategoriesPlatforms'), error);
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
    const hasImageError = !imageFile ? t('imageIsRequired') : '';
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
          alert(t('couldNotAttachTheImage'));
          return;
        }
      } catch (err) {
        console.error(err);
        alert(t('errorWhileUploading'));
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
        alert(t('gameAdded'));
      } else {
        const msg = await res.text();
        alert(t('error') + msg);
      }
    } catch (err) {
      alert(t('networkError'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField label={t('gameTitle')} name="title" value={form.title} onChange={handleChange}
          error={!!errors.title} helperText={errors.title} required />
        <TextField label={t('gameDescription')} name="description" multiline rows={4}
          value={form.description} onChange={handleChange}
          error={!!errors.description} helperText={errors.description} required />
        <TextField label={t('price')} name="price" type="number"
          value={form.price} onChange={handleChange}
          error={!!errors.price} helperText={errors.price} required />
        <TextField label={t('releaseDate')} name="releaseDate" type="date"
          value={form.releaseDate} onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.releaseDate} helperText={errors.releaseDate} required />
        <TextField label={t('publisher')} name="publisher" value={form.publisher} onChange={handleChange}
          error={!!errors.publisher} helperText={errors.publisher} required />
        <TextField label={t('rating')} name="rating" type="number"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          value={form.rating} onChange={handleChange}
          error={!!errors.rating} helperText={errors.rating} required />
        <TextField label={t('stockQuantity')} name="stockQuantity" type="number"
          value={form.stockQuantity} onChange={handleChange}
          error={!!errors.stockQuantity} helperText={errors.stockQuantity} required />

        <Button variant="outlined" component="label">
          {t('chooseImage')}
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
            {t('chosenFile')} {imageFile.name}
          </Box>
        )}

        <FormControl fullWidth error={!!errors.categoryIds}>
          <InputLabel>{t('categories.categories')}</InputLabel>
          <Select
            multiple
            value={form.categoryIds}
            name="categoryIds"
            onChange={handleMultiChange}
            input={<OutlinedInput label="Categories" />}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {t(`categories.${cat.name}`, cat.name)}
              </MenuItem>
            ))}
          </Select>
          {errors.categoryIds && <FormHelperText>{errors.categoryIds}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth error={!!errors.platformIds}>
          <InputLabel>{t('platforms')}</InputLabel>
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
            {t('addGame')}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
