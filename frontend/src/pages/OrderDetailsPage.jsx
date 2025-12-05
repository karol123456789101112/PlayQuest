import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer, CircularProgress, Divider, Button
} from '@mui/material';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useTranslation} from 'react-i18next';
import '../i18n';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/orders/${id}`, {
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,},
        });
        const data = await res.json();
        setOrder(data);
        console.log(data)
      } catch (error) {
        console.error("Error while downloading the order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;
  if (!order) return <Box p={4}><Typography>The order was not found.</Typography></Box>;

  return (
    <div>
        <Header userName='userName'></Header>
        <Box p={4} sx={{minHeight: '100vh'}}>
          <Typography variant="h4" gutterBottom>{t('orderDetails')} #{order.id}</Typography>

          {/* Order Info */}
          <Typography><strong>{t('orderDate')}:</strong> {new Date(order.orderDate).toLocaleString()}</Typography>
          <Typography><strong>{t('deliveryStatus')}:</strong> {t(`statusOptions.${order.status}`)}</Typography>
          <Typography><strong>{t('paymentStatus.paymentStatus')}:</strong> {t(`paymentStatus.${order.paymentStatus}`)}</Typography>

          {order.paymentStatus !== 'SUCCEEDED' && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    navigate(`/payment/${order.id}`, {
                      state: { amount: order.totalAmount }
                    })
                  }
                >
                  {t('paymentStatus.payNow')}
                </Button>
              </Box>
            )}

          <Divider sx={{ my: 3 }} />

          {/* Address */}
          <Typography variant="h6">{t('deliveryAddress')}</Typography>
          <Typography>{order.contactAddress.firstName} {order.contactAddress.lastName}</Typography>
          <Typography>{order.contactAddress.email}, {order.contactAddress.phoneNumber}</Typography>
          <Typography>
            {order.contactAddress.street} {order.contactAddress.buildingNumber}
            {order.contactAddress.apartmentNumber ? `/${order.contactAddress.apartmentNumber}` : ''},<br />
            {order.contactAddress.postalCode} {order.contactAddress.city}, {order.contactAddress.country}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Items */}
          <Typography variant="h6" gutterBottom>{t('products')}</Typography>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('gameTitle')}</TableCell>
                  <TableCell>{t('price')}</TableCell>
                  <TableCell>{t('quantity')}</TableCell>
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
            <strong>{t('totalAmount')}:</strong> {order.totalAmount} zł
          </Typography>
        </Box>
        <Footer />
    </div>
  );
};

export default OrderDetailsPage;
