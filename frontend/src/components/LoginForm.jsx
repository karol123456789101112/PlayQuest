import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../security/authContext';
import {
    Box,
    Button,
    Stack,
    TextField,
} from '@mui/material';

export default function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

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
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
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
                        Sign in
                    </Button>
                </Box>

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/register')}
                    sx={{ padding: '10px 25px', fontSize: '16px', borderRadius: '8px' }}
                  >
                    Sign up
                  </Button>
                </Box>

            </Stack>
        </Box>
    );
}
