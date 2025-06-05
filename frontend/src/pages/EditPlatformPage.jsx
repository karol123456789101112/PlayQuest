import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPlatformPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validateName = (name) => {
    if (!name) return 'Platform name is required';
    if (name.length > 80) return 'Max 80 characters allowed';
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(name)) return 'Only letters, spaces, and hyphens allowed';
    return '';
  };

  useEffect(() => {
    fetch(`http://localhost:8080/platforms/${id}`)
      .then(res => res.json())
      .then(data => setPlatform(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlatform(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(platform.name);
    setErrors({ name: nameError });
    if (nameError) return;

    let uploadedImageUrl = platform.imageUrl;

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
        alert('Image upload error');
        return;
      }
    }

    const updated = { ...platform, imageUrl: uploadedImageUrl };
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/platforms/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert('Platform has been updated!');
      navigate('/admin');
    } else if (res.status === 400) {
      const msg = await res.json();
      setErrors(msg);
    } else {
      const msg = await res.text();
      alert('Error:\n' + msg);
    }
  };

  if (!platform) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5">Edit Platform</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={platform.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <Button type="submit" variant="contained">Save</Button>
        </Stack>
      </form>
    </Box>
  );
}
