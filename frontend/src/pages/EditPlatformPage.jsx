import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography, Snackbar, Alert as MuiAlert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function EditPlatformPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const validateName = (name) => {
    if (!name) return t('platformNameIsRequired');
    if (name.length > 80) return t('platformNameReq1');
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(name)) return t('platformNameReq2');
    return '';
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        alert(t('couldNotAttachTheImage'));
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
      setSnackbar({
         open: true,
         message: t('platformHasBeenUpdated'),
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
         message: t('Error:\n' + msg),
         severity: 'error',
      });
    }
  };

  if (!platform) return <Typography>{t('loading')}</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5">{t('editPlatform')}</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label={t('name')}
            name="name"
            value={platform.name}
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
