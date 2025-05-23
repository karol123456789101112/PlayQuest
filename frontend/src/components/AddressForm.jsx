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
      alert("Adres dodany!");
    } catch (error) {
      alert("Błąd przy dodawaniu adresu: " + error.message);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">Dodaj nowy adres</Typography>
      <FormGroup sx={{ gap: 2, mt: 2 }}>
        <TextField label="Imię" name="firstName" value={newAddress.firstName} onChange={handleChange} />
        <TextField label="Nazwisko" name="lastName" value={newAddress.lastName} onChange={handleChange} />
        <TextField label="Email" name="email" value={newAddress.email} onChange={handleChange} />
        <TextField label="Telefon" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleChange} />
        <TextField label="Ulica" name="street" value={newAddress.street} onChange={handleChange} />
        <TextField label="Nr budynku" name="buildingNumber" value={newAddress.buildingNumber} onChange={handleChange} />
        <TextField label="Nr mieszkania (opcjonalnie)" name="apartmentNumber" value={newAddress.apartmentNumber} onChange={handleChange} type="number" />
        <TextField label="Miasto" name="city" value={newAddress.city} onChange={handleChange} />
        <TextField label="Kod pocztowy" name="postalCode" value={newAddress.postalCode} onChange={handleChange} />
        <TextField label="Kraj" name="country" value={newAddress.country} onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>
          Dodaj adres
        </Button>
      </FormGroup>
    </Box>
  );
};

export default AddressForm;
