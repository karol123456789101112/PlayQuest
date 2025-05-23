import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputLabel,
  Stack,
} from '@mui/material';
import { register } from '../services/authService';

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Hasła się nie zgadzają!');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('email', form.email);
    formData.append('password', form.password);
    if (form.profileImage) {
      formData.append('profileImage', form.profileImage);
    }

    try {
      await register(formData);
      alert('Rejestracja udana!');
    } catch (err) {
      console.error(err);
      alert('Błąd podczas rejestracji');
    }
  };

  return (
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <TextField
              fullWidth
              label="Imię"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
          />
          <TextField
              fullWidth
              label="Nazwisko"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
          />
          <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
          />
          <TextField
              fullWidth
              type="password"
              label="Hasło"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
          />
          <TextField
              fullWidth
              type="password"
              label="Powtórz hasło"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
          />
          <Box>
            <InputLabel shrink sx={{ mb: 1, color: '#ccc' }}>
              Zdjęcie profilowe
            </InputLabel>
            <Button
                variant="outlined"
                component="label"
                fullWidth
                color="secondary"
            >
              ➕ Dodaj zdjęcie
              <input
                  type="file"
                  name="profileImage"
                  hidden
                  onChange={handleChange}
              />
            </Button>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ padding: '12px 30px', fontSize: '18px', borderRadius: '8px' }}
            >
              Zarejestruj się
            </Button>
          </Box>
        </Stack>
      </Box>
  );
}
