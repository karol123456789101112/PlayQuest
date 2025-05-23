import React, { useState } from 'react';
import { TextField, Button, Stack } from '@mui/material';

export default function AddPlatformForm() {
  const [form, setForm] = useState({ name: ''});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/platforms/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Platforma dodana!');
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
          label="Platform Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Platform
        </Button>
      </Stack>
    </form>
  );
}
