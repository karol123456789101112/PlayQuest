import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography, Snackbar, Alert as MuiAlert } from '@mui/material';
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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
      setSnackbar({
         open: true,
         message: t('categoryHasBeenUpdated'),
         severity: 'success',
      });

      setTimeout(() => {
        navigate('/admin');
      }, 3000)
    } else if (res.status === 400) {
      const msg = await res.json();
      setErrors(msg);
    } else {
      const msg = await res.text();
      setSnackbar({
         open: true,
         message: t('error')  + ':\n' + msg,
         severity: 'error',
      });
    }
  };

  if (!category) return <Typography>{t('loading')}</Typography>;

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
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
        </Stack>
      </form>
    </Box>
  );
}
