import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/categories/${id}`)
      .then(res => res.json())
      .then(data => setCategory(data));
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrl = category.imageUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await fetch('http://localhost:8080/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        uploadedImageUrl = await res.text();
      } else {
        alert('Error while attaching the image');
        return;
      }
    }

    const updated = { ...category, imageUrl: uploadedImageUrl };

    const res = await fetch(`http://localhost:8080/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert('Category has been updated!');
      navigate('/admin');
    } else {
      alert('Update error');
    }
  };

  if (!category) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5">Edit category</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
{/*           <Button variant="outlined" component="label"> */}
{/*             Wybierz nowy obrazek */}
{/*             <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /> */}
{/*           </Button> */}
{/*           {imageFile && ( */}
{/*             <Typography variant="body2" sx={{ color: '#888' }}> */}
{/*               Wybrano: {imageFile.name} */}
{/*             </Typography> */}
{/*           )} */}
          <Button type="submit" variant="contained">Save</Button>
        </Stack>
      </form>
    </Box>
  );
}
