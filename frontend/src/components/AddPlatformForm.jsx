import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { useTranslation} from 'react-i18next';
import '../i18n';

export default function AddPlatformForm() {
  const [form, setForm] = useState({ name: ''});
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

  const validate = (value) => {
    if (!value) return t('platformNameIsRequired')
    if (value.length > 80) return t('platformNameReq1')
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(value)) {
      return t('platformNameReq2');
    }
    return '';
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
        alert(t('platformAdded'));
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
      </Stack>
    </form>
  );
}
