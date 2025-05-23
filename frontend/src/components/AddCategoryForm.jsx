import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

export default function AddCategoryForm() {
  const [form, setForm] = useState({ name: ''});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Kategoria dodana!');
        setForm({ name: ''});
      } else {
        alert('Błąd podczas dodawania');
      }
    } catch (err) {
      console.error(err);
      alert('Błąd sieci');
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
        />
        <Button type="submit" variant="contained" color="primary">
          Add Category
        </Button>
      </Stack>
    </form>
  );
}
