import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
    return (
        <Container
            maxWidth="sm"
            sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        >
            <Box width="100%">
                <Typography variant="h2" align="center" gutterBottom>
                   PlayQuest
                </Typography>
                <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#111' }}>
                    <RegisterForm />
                </Paper>
            </Box>
        </Container>
    );
}
