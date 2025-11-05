import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Stack, Typography } from '@mui/material';
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

  const validateName = (name) => {
    if (!name) return t('platformNameIsRequired');
    if (name.length > 80) return t('platformNameReq1');
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(name)) return t('platformNameReq2');
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
      alert(t('platformHasBeenUpdated'));
      navigate('/admin');
    } else if (res.status === 400) {
      const msg = await res.json();
      setErrors(msg);
    } else {
      const msg = await res.text();
      alert('Error:\n' + msg);
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
        </Stack>
      </form>
    </Box>
  );
}
