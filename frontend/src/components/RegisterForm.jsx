import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { t, i18n } = useTranslation();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validators = {
    firstName: (val) => {
      if (!val) return t('firstNameIsRequired');
      if (!/^[A-Za-z]{1,40}$/.test(val)) return t('firstNameValid');
      return '';
    },
    lastName: (val) => {
      if (!val) return t('lastNameIsRequired');
      if (!/^[A-Za-z\s\-]{1,80}$/.test(val)) return t('lastNameValid');
      return '';
    },
    email: (val) => {
      if (!val) return t('emailIsRequired');
      if (val.length > 80) return t('max80Char');
      if (!/^\S+@\S+\.\S+$/.test(val)) return t('emailValid');
      return '';
    },
    password: (val) => {
      if (!val) return t('passwordIsRequired');;
      if (val.length < 8 || val.length > 40) return t('passwordReq1')
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(val)) {
        return t('passwordReq2');
      }
      return '';
    },
    confirmPassword: (val) => {
      if (val !== form.password) return t('passwordsDoNotMatch');
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
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         firstName: form.firstName,
         lastName: form.lastName,
         email: form.email,
         password: form.password}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error('Register error');
      }
      setSnackbar({
        open: true,
        message: t('registrationMessage'),
        severity: 'success',
      });
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
      setSnackbar({
        open: true,
        message: 'Error while signing up',
        severity: 'error',
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>{t('signUpLow')}</Typography>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label={t('firstName')}
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <TextField
          fullWidth
          label={t('lastName')}
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
        <TextField
          fullWidth
          type="email"
          label={t('email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          type="password"
          label={t('password')}
          name="password"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth
          type="password"
          label={t('confirmPassword')}
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
            {t('signUpUpp')}
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
        </Box>
      </Stack>
    </Box>
  );
}
