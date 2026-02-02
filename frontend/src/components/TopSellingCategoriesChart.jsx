import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n';

const COLORS = [
  '#e5e7eb',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
];

export default function TopSellingCategoriesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('http://localhost:8080/stats/top-categories', {
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
        {t('topSellingCategories')}
      </Typography>

      <Typography
        variant="body2"
        sx={{ mb: 3, color: '#cbd5e1' }}
      >
        {t('categorySalesDescription')}
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
          <PieChart>
            <Pie
              data={data}
              dataKey="totalSold"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={80}
              labelLine={false}
              label={({ category, totalSold }) =>
                `${t(`categories.${category}`)} : ${totalSold}`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: 8,
                border: '1px solid #334155',
                color: '#ffffff',
              }}
              formatter={(value, name, props) => [
                `${value} ${t('soldUnits')}`,
                t(`categories.${props.payload.category}`),
              ]}
            />

            <Legend
              formatter={(value) => (
                <span style={{ color: '#cbd5e1' }}>
                  {t(`categories.${value}`)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
