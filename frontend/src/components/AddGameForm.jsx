import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, platRes] = await Promise.all([
          fetch('http://localhost:8080/categories'),
          fetch('http://localhost:8080/platforms'),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: [...value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = '';
    if (imageFile) {
      const imageData = new FormData();
      imageData.append('file', imageFile);

      try {
        const imgRes = await fetch('http://localhost:8080/upload-image', {
          method: 'POST',
          body: imageData,
        });

        if (imgRes.ok) {
          uploadedImageUrl = await imgRes.text(); // np. "/images/abc.jpg"
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
      const res = await fetch('http://localhost:8080/games/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <TextField label="Game Title" name="title" value={form.title} onChange={handleChange} required />
        <TextField
          label="Game Description"
          name="description"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
        <TextField
          label="Price (PLN)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />
        <TextField
          label="Release Date"
          name="releaseDate"
          type="date"
          value={form.releaseDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField label="Publisher" name="publisher" value={form.publisher} onChange={handleChange} required />
        <TextField
          label="Rating (0-10)"
          name="rating"
          type="number"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          value={form.rating}
          onChange={handleChange}
          required
        />
        <TextField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          value={form.stockQuantity}
          onChange={handleChange}
          required
        />
        <Button variant="outlined" component="label">
          Choose image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </Button>
        {imageFile && (
          <Box mt={1} sx={{ color: '#aaa', fontSize: 14 }}>
            Chosen file: {imageFile.name}
          </Box>
        )}

        {/* Kategorie */}
        <FormControl fullWidth>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={form.categoryIds}
            name="categoryIds"
            onChange={handleMultiChange}
            input={<OutlinedInput label="Kategorie" />}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Platformy */}
        <FormControl fullWidth>
          <InputLabel>Platforms</InputLabel>
          <Select
            multiple
            value={form.platformIds}
            name="platformIds"
            onChange={handleMultiChange}
            input={<OutlinedInput label="Platformy" />}
          >
            {platforms.map((plat) => (
              <MenuItem key={plat.id} value={plat.id}>
                {plat.name}
              </MenuItem>
            ))}
          </Select>
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
