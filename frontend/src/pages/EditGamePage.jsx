import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Stack, Typography, CircularProgress, MenuItem, Select, FormControl,
   OutlinedInput, InputLabel
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
    setGame({ ...game, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = game.imageUrl;

    if (newImageFile) {
      const formData = new FormData();
      formData.append('file', newImageFile);

      try {
        const imgRes = await fetch('http://localhost:8080/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (imgRes.ok) {
          uploadedImageUrl = await imgRes.text();
        } else {
          alert('Could not attach the image');
          return;
        }
      } catch (err) {
        alert('Image Upload error');
        return;
      }
    }

    const updatedGame = { ...game, imageUrl: uploadedImageUrl, categoryIds: game.categoryIds,
     platformIds: game.platformIds};

    try {
      const res = await fetch(`http://localhost:8080/games/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGame),
      });

      if (res.ok) {
        alert('Game updated!');
        navigate('/admin');
      } else {
        alert('Update error');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  if (loading) return <CircularProgress />;
  if (!game) return <Typography>Game was not found.</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit the game</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={game.title || ''} onChange={handleChange} required />
          <TextField label="Description" name="description" value={game.description || ''} onChange={handleChange} multiline rows={4} required />
          <TextField label="Price" name="price" value={game.price || ''} onChange={handleChange} type="number" />
          <TextField label="Release Date" name="releaseDate" value={game.releaseDate || ''} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="Publisher" name="publisher" value={game.publisher || ''} onChange={handleChange} />
          <TextField label="Rating" name="rating" value={game.rating || ''} onChange={handleChange} type="number" inputProps={{ step: 0.1, min: 0, max: 10 }} />
          <TextField label="Stock Quantity" name="stockQuantity" value={game.stockQuantity || ''} onChange={handleChange} type="number" />
          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              name="categoryIds"
              value={game.categoryIds || []}
              onChange={(e) => setGame({ ...game, categoryIds: e.target.value })}
              input={<OutlinedInput label="Categories" />}
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              name="platformIds"
              value={game.platformIds || []}
              onChange={(e) => setGame({ ...game, platformIds: e.target.value })}
              input={<OutlinedInput label="Platforms" />}
            >
              {platforms.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" component="label">
            Change image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setNewImageFile(e.target.files[0])}
            />
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
