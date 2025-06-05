import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

export default function AddCategoryForm() {
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');

  const validate = (value) => {
    if (!value) return 'Category name is required';
    if (value.length > 80) return 'Maximum 80 characters allowed';
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s\-]+$/.test(value)) {
      return 'Only letters, spaces, and hyphens are allowed';
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
        alert('Category added!');
        setForm({ name: '' });
        setError('');
      } else {
        alert('Error while adding category');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained" color="primary">
          Add Category
        </Button>
      </Stack>
    </form>
  );
}
