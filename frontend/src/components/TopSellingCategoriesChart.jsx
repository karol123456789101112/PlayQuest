import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

const COLORS = ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#1e88e5'];

export default function TopSellingCategoriesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/top-categories', {
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
        background: 'linear-gradient(135deg, #3EAB76 0%, #3E4BAB 100%)',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#000000' }}>
        {t('topSellingCategories')}
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: '#000000' }}>
        {t('categorySalesDescription')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('errorPrefix')} {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="totalSold"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              labelLine={false}
              label={({ category, totalSold }) =>
                `${t(`categories.${category}`)}: ${totalSold} ${t('soldUnits')}`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
              }}
              formatter={(value, name, props) => [`${value} ${t('soldUnits')}`, t(`categories.${props.payload.category}`)]}
            />
            <Legend formatter={(value) => t(`categories.${value}`)} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
