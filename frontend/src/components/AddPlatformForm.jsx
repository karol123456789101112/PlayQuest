import React, { useState } from 'react';
import { TextField, Button, Stack, Snackbar, Alert as MuiAlert } from '@mui/material';
import { useTranslation} from 'react-i18next';
import '../i18n';

export default function AddPlatformForm() {
  const [form, setForm] = useState({ name: ''});
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const validate = (value) => {
    if (!value) return t('platformNameIsRequired')
    if (value.length > 80) return t('platformNameReq1')
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(value)) {
      return t('platformNameReq2');
    }
    return '';
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'name') {
      const validationMessage = validate(value);
      setError(validationMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validate(form.name);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/platforms/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,},
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSnackbar({
           open: true,
           message: t('platformAdded'),
           severity: 'success',
        });
        setForm({ name: ''});
        setError('');
      } else {
        alert(t('errorWhileAddingPlatform'));
      }
    } catch (err) {
      console.error(err);
      alert(t('networkError'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label={t('platformName')}
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" color="primary">
          {t('addPlatform')}
        </Button>
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
  );
}
