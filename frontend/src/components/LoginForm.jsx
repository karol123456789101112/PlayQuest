import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../security/authContext';
import {
    Box,
    Button,
    Stack,
    TextField,
    Snackbar,
    Alert as MuiAlert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';


export default function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t, i18n } = useTranslation();
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success',
    });

    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                  }),
                });

            if (!response.ok) {
                const errorText = await response.text();
                setSnackbar({
                  open: true,
                  message: t(errorText),
                  severity: 'error',
                });
                return;
            }

            const data = await response.json();

            if (data.token) {
                login(data.token);
                navigate('/');
            } else {
                alert('Login failed');
             }
        } catch (err) {
            console.error(err);
            alert('Logging error');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    label={t('email')}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    label={t('password')}
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Box display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ padding: '12px 30px', fontSize: '18px', borderRadius: '8px' }}
                    >
                        {t('signInUpp')}
                    </Button>
                </Box>

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/register')}
                    sx={{ padding: '10px 25px', fontSize: '16px', borderRadius: '8px' }}
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
