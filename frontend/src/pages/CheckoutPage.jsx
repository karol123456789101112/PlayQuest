import React, { useEffect, useState } from 'react';
import {
  Box, Typography, RadioGroup, FormControlLabel, Radio, Button, CircularProgress,
   TextField, FormGroup, Checkbox
} from '@mui/material';
import { useAuth } from '../security/authContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const CheckoutPage = () => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    postalCode: '',
    country: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    isDefault: false
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/addresses?userId=${userId}`);
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

    fetchAddresses();
  }, [userId]);

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      alert("Choose delivery address.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      alert("Order placed!");
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      alert("Network error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:8080/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAddress,
          user: { id: userId }
        })
      });

      if (!response.ok) throw new Error(await response.text());

      const added = await response.json();
      setAddresses(prev => [...prev, added]);
      setSelectedAddressId(added.id);

      setNewAddress({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        postalCode: '',
        country: '',
        street: '',
        buildingNumber: '',
        apartmentNumber: '',
        isDefault: false
      });

      alert("Address added!");
    } catch (error) {
      alert("Error while adding the address: " + error.message);
    }
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
        <Header userName='userName'></Header>
        <Box p={4} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Typography variant="h4" gutterBottom>Choose delivery address</Typography>

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
            label="Add new delivery adddress"
          />
          {showForm && (
          <Box mt={4}>
            <Typography variant="h6">Add new address</Typography>
            <FormGroup sx={{ gap: 2, mt: 2 }}>
              <TextField label="Firs name" name="firstName" value={newAddress.firstName} onChange={handleChange} />
              <TextField label="Last name" name="lastName" value={newAddress.lastName} onChange={handleChange} />
              <TextField label="Email" name="email" value={newAddress.email} onChange={handleChange} />
              <TextField label="Phone number" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleChange} />
              <TextField label="Street" name="street" value={newAddress.street} onChange={handleChange} />
              <TextField label="Building number" name="buildingNumber" value={newAddress.buildingNumber} onChange={handleChange} />
              <TextField label="Apartment Number (not required)" name="apartmentNumber" value={newAddress.apartmentNumber} onChange={handleChange} type="number"/>
              <TextField label="City" name="city" value={newAddress.city} onChange={handleChange} />
              <TextField label="Postal Code" name="postalCode" value={newAddress.postalCode} onChange={handleChange} />
              <TextField label="Country" name="country" value={newAddress.country} onChange={handleChange} />
              <Button variant="contained" onClick={handleAddAddress}>
                Add the address
              </Button>
            </FormGroup>
          </Box>
         )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitOrder}
            sx={{ mt: 3 }}
          >
            Place the order
          </Button>
        </Box>
        <Footer />
    </div>
  );
};

export default CheckoutPage;
