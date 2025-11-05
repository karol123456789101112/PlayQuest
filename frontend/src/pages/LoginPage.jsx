import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function LoginPage() {
    const { t, i18n } = useTranslation();

    return (
        <Container
            maxWidth="sm"
            sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        >
            <Box width="100%">
                <Typography variant="h2" align="center" gutterBottom>
                    {t('appName')}
                </Typography>
                <Paper elevation={6} sx={{ padding: 4, backgroundColor: '#111' }}>
                    <LoginForm />
                </Paper>
            </Box>
        </Container>
    );
}


