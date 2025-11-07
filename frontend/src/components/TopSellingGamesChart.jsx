import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Typography, Box, Paper, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function GamesStatisticsPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/top-games', {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => {
        if (!res.ok) throw new Error(t('errorLoadingData'));
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error(t('invalidDataFormat'));
        setData(data);
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
        background: 'linear-gradient(135deg, #AB5F3E 0%, #403EAB 100%)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
        {t('topSellingGames')}
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: '#000000' }}>
        {t('salesRankingDescription')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('errorPrefix')} {error}
        </Alert>
      )}

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ width: `${data.length * 140}px`, height: 500 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 100 }}
            >
              <defs>
                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#76AB3E" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#76AB3E" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis
                dataKey="title"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={120}
                tick={{ fill: '#000000', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#000000' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                }}
                formatter={(value) => [`${value} ${t('soldUnits')}`]}
              />
              <Bar
                dataKey="totalSold"
                fill="url(#barColor)"
                radius={[8, 8, 0, 0]}
                label={{ position: 'top', fill: '#000000', fontWeight: 500 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
}