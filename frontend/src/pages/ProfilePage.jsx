 import React from 'react';
 import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
 import Header from '../components/Header';
 import OrderListComponent from '../components/OrderListComponent';
 import Footer from '../components/Footer';
 import { useNavigate } from 'react-router-dom';

export default function HomePage() {
     const navigate = useNavigate();
     const userName = 'Jan';
     return (
         <div>
             <Header userName='userName'></Header>
                 <Button
                   variant="outlined"
                   onClick={() => navigate('/addresses')}
                   sx={{ mb: 3 }}
                 >
                   Zarządzaj adresami
             </Button>
             <OrderListComponent />
             <Footer />
         </div>
     );
 }