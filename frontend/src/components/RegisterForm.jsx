import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
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
  });

  const [errors, setErrors] = useState({});

  const validators = {
    firstName: (val) => {
      if (!val) return 'First name is required';
      if (!/^[A-Za-z]{1,40}$/.test(val)) return 'Only letters, max 40 characters';
      return '';
    },
    lastName: (val) => {
      if (!val) return 'Last name is required';
      if (!/^[A-Za-z\s\-]{1,80}$/.test(val)) return 'Only letters, spaces, hyphens, max 80 characters';
      return '';
    },
    email: (val) => {
      if (!val) return 'Email is required';
      if (val.length > 80) return 'Max 80 characters';
      if (!/^\S+@\S+\.\S+$/.test(val)) return 'Invalid email format';
      return '';
    },
    password: (val) => {
      if (!val) return 'Password is required';
      if (val.length < 8 || val.length > 40) return 'Must be 8–40 characters';
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(val)) {
        return 'Must include uppercase, lowercase, number, special character';
      }
      return '';
    },
    confirmPassword: (val) => {
      if (val !== form.password) return 'Passwords do not match';
      return '';
    }
  };

  const validateField = (name, value) => {
    const error = validators[name] ? validators[name](value) : '';
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = Object.fromEntries(
      Object.entries(form).map(([key, val]) => [key, validators[key] ? validators[key](val) : ''])
    );

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      alert('You have been registered!');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert('Error while signing up');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>Sign up</Typography>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="First name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          fullWidth
          label="Last name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          fullWidth
          type="email"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Box display="flex" justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: '12px 30px', fontSize: '18px', borderRadius: '8px' }}
          >
            Sign up
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
