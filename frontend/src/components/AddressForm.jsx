import React, { useState } from 'react';
import {
  Box, TextField, FormGroup, Button, Typography
} from '@mui/material';

const AddressForm = ({ userId, onSuccess }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
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

      if (onSuccess) onSuccess(added);
      alert("Address added!");
    } catch (error) {
      alert("Error while adding address: " + error.message);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Add new address</Typography>
      <FormGroup sx={{ gap: 2, mt: 2 }}>
        <TextField label="First name" name="firstName" value={newAddress.firstName} onChange={handleChange} />
        <TextField label="Last name" name="lastName" value={newAddress.lastName} onChange={handleChange} />
        <TextField label="Email" name="email" value={newAddress.email} onChange={handleChange} />
        <TextField label="Phone number" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleChange} />
        <TextField label="Street" name="street" value={newAddress.street} onChange={handleChange} />
        <TextField label="Building Number" name="buildingNumber" value={newAddress.buildingNumber} onChange={handleChange} />
        <TextField label="Apartment number (not required)" name="apartmentNumber" value={newAddress.apartmentNumber} onChange={handleChange} type="number" />
        <TextField label="City" name="city" value={newAddress.city} onChange={handleChange} />
        <TextField label="Postal code" name="postalCode" value={newAddress.postalCode} onChange={handleChange} />
        <TextField label="Country" name="country" value={newAddress.country} onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>
          Add address
        </Button>
      </FormGroup>
    </Box>
  );
};

export default AddressForm;
