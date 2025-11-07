import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/monthly-sales', {
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
        background: 'linear-gradient(135deg, #3E7FAB 0%, #3EAB5F 100%)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
        {t('monthlySalesTitle')}
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: '#000000' }}>
        {t('monthlySalesDescription')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('errorPrefix')} {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#76AB3E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3E7FAB" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="month" tick={{ fill: '#000000' }} />
            <YAxis tick={{ fill: '#000000' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#000000',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
              }}
              formatter={(value) => [`${value} ${t('gamesSold')}`, t('totalSales')]}
            />
            <Line
              type="monotone"
              dataKey="totalSold"
              stroke="url(#lineColor)"
              strokeWidth={3}
              dot={{ r: 5, fill: '#1976d2' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
