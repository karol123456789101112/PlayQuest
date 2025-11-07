import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Typography, Box, Paper } from '@mui/material';
import TopSellingGamesChart from '../components/TopSellingGamesChart';
import TopSellingCategoriesChart from '../components/TopSellingCategoriesChart';
import MonthlySalesChart from '../components/MonthlySalesChart';
import AveragePriceCard from '../components/AveragePriceCard';
import Header from '../components/Header';
import Footer from '../components/Footer'


export default function GamesStatisticsPage() {
  return (
    <div>
      <Header userName='userName'></Header>
      <Box sx={{minHeight: '100vh' }}>
      <TopSellingGamesChart />
      <TopSellingCategoriesChart />
      <MonthlySalesChart />
      <AveragePriceCard />
      </Box>
      <Footer />
    </div>
  );
}
