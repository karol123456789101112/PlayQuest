import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer, CircularProgress, Button
} from '@mui/material';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation} from 'react-i18next';
import '../i18n';

const OrderListPage = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/orders?userId=${userId}`, {
        headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,},
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error while downloading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>{t('yourOrders')}</Typography>
      {orders.length === 0 ? (
        <Typography>{t('youDoNotHaveAnyOrdersYet')}.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>{t('orderId')}</strong></TableCell>
                <TableCell><strong>{t('date')}</strong></TableCell>
                <TableCell><strong>{t('status')}</strong></TableCell>
                <TableCell><strong>{t('details')}</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{t(`statusOptions.${order.status}`)}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                      {t('details')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrderListPage;
