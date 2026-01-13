import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { useTranslation} from 'react-i18next';

export default function AddCategoryForm() {
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();

  const validate = (value) => {
    if (!value) return t('categoryNameIsRequired')
    if (value.length > 80) return t('categoryNameReq1')
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(value)) {
      return t('categoryNameReq2');
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
      const res = await fetch('http://localhost:8080/categories/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert(t('categoryAdded'));
        setForm({ name: '' });
        setError('');
      } else {
        alert(t('errorWhileAddingCategory'));
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
          label={t('categoryName')}
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" color="primary">
          {t('addCategory')}
        </Button>
      </Stack>
    </form>
  );
}
