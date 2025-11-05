import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();

  const validateName = (name) => {
    if (!name) return t('categoryNameIsRequired');
    if (name.length > 80) return t('categoryNameReq1');
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(name)) return t('categoryNameReq2');
    return '';
  };

  useEffect(() => {
    fetch(`http://localhost:8080/categories/${id}`)
      .then(res => res.json())
      .then(data => setCategory(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(category.name);
    setErrors({ name: nameError });
    if (nameError) return;

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
        alert(t('couldNotAttachTheImage'));
        return;
      }
    }

    const updated = { ...category, imageUrl: uploadedImageUrl };
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8080/categories/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      alert(t('categoryHasBeenUpdated'));
      navigate('/admin');
    } else if (res.status === 400) {
      const msg = await res.json();
      setErrors(msg);
    } else {
      const msg = await res.text();
      alert(t('error') + ':\n' + msg);
    }
  };

  if (!category) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5">{t('editCategory')}</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label={t('name')}
            name="name"
            value={category.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <Button type="submit" variant="contained">{t('save')}</Button>
        </Stack>
      </form>
    </Box>
  );
}
