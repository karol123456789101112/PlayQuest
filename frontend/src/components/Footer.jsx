import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#111',
        color: '#fff',
        padding: '40px 20px',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* About Us */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body2">
            We are a leading online store offering a wide range of products at competitive prices.
          </Typography>
        </Grid>

        {/* Useful Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Useful Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href="#" underline="hover" color="inherit">Privacy Policy</Link>
            <Link href="#" underline="hover" color="inherit">Terms and Conditions</Link>
            <Link href="#" underline="hover" color="inherit">Return Policy</Link>
            <Link href="#" underline="hover" color="inherit">Contact</Link>
          </Box>
        </Grid>

        {/* Contact */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Typography variant="body2">Email: contact@playquest.com</Typography>
          <Typography variant="body2">Phone: +48 123 456 789</Typography>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="gray">
          © 2025 PlayQuest. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
