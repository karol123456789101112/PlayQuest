import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/monthly-sales', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
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
      elevation={6}
      sx={{
        p: 4,
        mt: 4,
        borderRadius: 3,
        backgroundColor: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#f1f5f9' }}
      >
        {t('monthlySalesTitle')}
      </Typography>

      <Typography
        variant="body2"
        sx={{ mb: 3, color: '#cbd5e1' }}
      >
        {t('monthlySalesDescription')}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: '#7f1d1d',
            color: '#fecaca',
          }}
        >
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
              <linearGradient id="lineGray" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: '#cbd5e1' }}
            />

            <YAxis
              tick={{ fill: '#cbd5e1' }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderRadius: 8,
                border: '1px solid #334155',
                color: '#e5e7eb',
              }}
              formatter={(value) => [
                `${value} ${t('gamesSold')}`,
                t('totalSales'),
              ]}
            />

            <Line
              type="monotone"
              dataKey="totalSold"
              stroke="url(#lineGray)"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#e5e7eb',
                stroke: '#0f172a',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: '#f1f5f9',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
