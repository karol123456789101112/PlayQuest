import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer, CircularProgress, Divider
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Błąd przy pobieraniu szczegółów zamówienia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (!order) return <Box p={4}><Typography>Nie znaleziono zamówienia.</Typography></Box>;

  return (
    <div>
        <Header userName='userName'></Header>
        <Box p={4} sx={{minHeight: '100vh'}}>
          <Typography variant="h4" gutterBottom>Szczegóły zamówienia #{order.id}</Typography>

          {/* Order Info */}
          <Typography><strong>Data zamówienia:</strong> {new Date(order.orderDate).toLocaleString()}</Typography>
          <Typography><strong>Status:</strong> {order.status}</Typography>

          <Divider sx={{ my: 3 }} />

          {/* Address */}
          <Typography variant="h6">Adres dostawy</Typography>
          <Typography>{order.contactAddress.firstName} {order.contactAddress.lastName}</Typography>
          <Typography>{order.contactAddress.email}, {order.contactAddress.phoneNumber}</Typography>
          <Typography>
            {order.contactAddress.street} {order.contactAddress.buildingNumber}
            {order.contactAddress.apartmentNumber ? `/${order.contactAddress.apartmentNumber}` : ''},<br />
            {order.contactAddress.postalCode} {order.contactAddress.city}, {order.contactAddress.country}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Items */}
          <Typography variant="h6" gutterBottom>Produkty</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tytuł gry</TableCell>
                  <TableCell>Cena</TableCell>
                  <TableCell>Ilość</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.videogame.title}</TableCell>
                    <TableCell>{item.gamePrice} zł</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total */}
          <Typography variant="h6">
            <strong>Łączna kwota:</strong> {order.totalAmount} zł
          </Typography>
        </Box>
        <Footer />
    </div>
  );
};

export default OrderDetailsPage;
