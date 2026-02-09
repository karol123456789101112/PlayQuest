import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import { useTranslation} from 'react-i18next';
import '../i18n';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#111',
        color: '#fff',
        padding: '40px 20px',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            {t('aboutUs')}
          </Typography>
          <Typography variant="body2">
           {t('websiteDescription')}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href="#" underline="hover" color="inherit">{t('links.privacyPolicy')}</Link>
            <Link href="#" underline="hover" color="inherit">{t('links.termsAndConditions')}</Link>
            <Link href="#" underline="hover" color="inherit">{t('links.returnPolicy')}</Link>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            {t('contact.contact')}
          </Typography>
          <Typography variant="body2">{t('contact.email')}: contact@playquest.com</Typography>
          <Typography variant="body2">{t('contact.phone')}: +48 123 456 789</Typography>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="gray">
          {t('copyright')}
        </Typography>
      </Box>
    </Box>
  );
}
