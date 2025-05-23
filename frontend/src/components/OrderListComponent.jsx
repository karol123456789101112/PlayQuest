import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, TableContainer, CircularProgress, Button
} from '@mui/material';
import { useAuth } from '../security/authContext';
import { useNavigate } from 'react-router-dom';

const OrderListPage = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8080/orders?userId=${userId}`);
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
      <Typography variant="h4" gutterBottom>Your orders</Typography>
      {orders.length === 0 ? (
        <Typography>You do not have any orders yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Details</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                      Details
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
