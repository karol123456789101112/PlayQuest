import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Divider
} from '@mui/material';
import { useAuth } from '../security/authContext';
import AddressForm from '../components/AddressForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AddressManagementPage = () => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/addresses?userId=${userId}`);
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Błąd przy pobieraniu adresów:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten adres?")) return;
    await fetch(`http://localhost:8080/addresses/${id}`, { method: 'DELETE' });
    fetchAddresses();
  };

  return (
    <div>
        <Header userName='userName'></Header>
        <Box p={4} sx={{ minHeight: '100vh'}}>
          <Typography variant="h4" gutterBottom>Twoje adresy</Typography>
          <Grid container spacing={2}>
            {addresses.map(addr => (
              <Grid item xs={12} md={6} key={addr.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{addr.firstName} {addr.lastName}</Typography>
                    <Typography>{addr.email} | {addr.phoneNumber}</Typography>
                    <Typography>
                      {addr.street} {addr.buildingNumber}
                      {addr.apartmentNumber ? `/${addr.apartmentNumber}` : ''}, {addr.postalCode} {addr.city}, {addr.country}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(addr.id)}>
                        Usuń
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        <AddressForm userId={userId} onSuccess={fetchAddresses} />
        </Box>
        <Footer />
    </div>
  );
};

export default AddressManagementPage;
