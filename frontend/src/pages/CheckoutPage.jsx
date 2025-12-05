import React, { useEffect, useState } from 'react';
import {
  Box, Typography, RadioGroup, FormControlLabel, Radio, Button, CircularProgress,
   TextField, FormGroup, Checkbox
} from '@mui/material';
import { useAuth } from '../security/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddressForm from '../components/AddressForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation} from 'react-i18next';
import '../i18n';


const CheckoutPage = () => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/addresses?userId=${userId}`, {
            headers: {'Authorization': `Bearer ${token}`,},
        });
        const data = await response.json();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data.find(addr => addr.isDefault)?.id || data[0].id);
        }
      } catch (error) {
        console.error("Error while downloading addresses:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
      fetchAddresses();
    }, [userId]);

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      alert("Choose delivery address.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          addressId: selectedAddressId
        })
      });

      if (!response.ok) {
        const message = await response.text();
        alert("Error: " + message);
        return;
      }

      const order = await response.json();
      const orderId = order.orderId;
      const amount = order.totalAmount;

      navigate(`/payment/${orderId}`, { state: { amount } });
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
    }
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
        <Header userName='userName'></Header>
        <Box p={4} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>{t('chooseDeliveryAddress')}</Typography>

          <RadioGroup
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(Number(e.target.value))}
          >
            {addresses.map(addr => (
              <FormControlLabel
                key={addr.id}
                value={addr.id}
                control={<Radio />}
                label={`${addr.firstName} ${addr.lastName}, ${addr.street} ${addr.buildingNumber}${addr.apartmentNumber ? '/' + addr.apartmentNumber : ''}, ${addr.city}, ${addr.postalCode}, ${addr.country}`}
              />
            ))}
          </RadioGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={showForm}
                onChange={(e) => setShowForm(e.target.checked)}
              />
            }
            label={t('addNewDeliveryAddress')}
          />
          {showForm && (
           <AddressForm userId={userId} onSuccess={fetchAddresses} />
         )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitOrder}
            sx={{ mt: 3 }}
          >
            {t('placeTheOrder')}
          </Button>
        </Box>
        <Footer />
    </div>
  );
};

export default CheckoutPage;
