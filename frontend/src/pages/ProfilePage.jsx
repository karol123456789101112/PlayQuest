 import React from 'react';
 import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
 import Header from '../components/Header';
 import OrderListComponent from '../components/OrderListComponent';
 import Footer from '../components/Footer';
 import { useNavigate } from 'react-router-dom';
 import { useTranslation} from 'react-i18next';
 import '../i18n';

export default function HomePage() {
     const navigate = useNavigate();
     const userName = 'Jan';
     const { t, i18n } = useTranslation();
     return (
         <div>
             <Header userName='userName'></Header>
             <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                     <Button
                       variant="outlined"
                       onClick={() => navigate('/addresses')}
                       sx={{ mb: 3 }}
                     >
                       {t('manageAddresses')}
                 </Button>
                 <OrderListComponent />
             </Box>
             <Footer />
         </div>
     );
 }