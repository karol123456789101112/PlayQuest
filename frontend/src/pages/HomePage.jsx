 import React from 'react';
 import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
 import { Link } from 'react-router-dom';
 import Header from '../components/Header';
 import ImageCarousel from '../components/ImageCarousel';
 import CategorySlider from '../components/CategorySlider';
 import PlatformSelector from '../components/PlatformSelector';
 import GameSlider from '../components/GameSlider';
 import Footer from '../components/Footer';

 export default function HomePage() {

     const userName = 'Jan';
     return (
         <div>
             <Header userName='userName'></Header>
             <Box sx={{minHeight: '100vh' }}>
             <ImageCarousel />
             <CategorySlider />
             <PlatformSelector />
             <GameSlider />
             </Box>
             <Footer />
         </div>
     );
 }