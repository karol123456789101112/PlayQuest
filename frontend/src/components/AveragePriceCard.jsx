import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function AveragePriceCard() {
  const [averagePrice, setAveragePrice] = useState(null);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/average-price', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => {
        if (!res.ok) throw new Error(t('errorLoadingData'));
        return res.json();
      })
      .then(data => {
        if (!data || typeof data.averagePrice !== 'number') {
          throw new Error(t('invalidDataFormat'));
        }
        setAveragePrice(data.averagePrice);
      })
      .catch(err => {
        console.error(t('dataFetchError'), err);
        setError(err.message);
      });
  }, [t]);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mt: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #AB3E3E 0%, #3E7FAB 100%)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
        {t('averagePriceTitle')}
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: '#000000' }}>
        {t('averagePriceDescription')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('errorPrefix')} {error}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        {averagePrice !== null ? (
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#000000' }}>
            {averagePrice.toFixed(2)} {t('currency')}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ color: '#000000' }}>
            {t('loading')}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
