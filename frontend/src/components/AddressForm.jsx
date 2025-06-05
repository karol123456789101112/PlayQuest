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

  const [errors, setErrors] = useState({});

  const validators = {
    firstName: (val) => {
      if (!val) return 'First name is required';
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{1,40}$/.test(val)) return 'Only letters, max 40 characters';
      return '';
    },
    lastName: (val) => {
      if (!val) return 'Last name is required';
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\- ]{1,80}$/.test(val)) return 'Only letters, spaces or hyphens, max 80 characters';
      return '';
    },
    email: (val) => {
      if (!val) return 'Email is required';
      if (!/^\S+@\S+\.\S+$/.test(val)) return 'Invalid email format';
      return '';
    },
    phoneNumber: (val) => {
      if (!val) return 'Phone number is required';
      if (!/^\d{9,10}$/.test(val)) return 'Must be 9 or 10 digits';
      return '';
    },
    street: (val) => {
      if (!val) return 'Street is required';
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\- ]{1,80}$/.test(val)) return 'Only letters, spaces and hyphens, max 80 characters';
      return '';
    },
    buildingNumber: (val) => {
      if (!val) return 'Building number is required';
      if (!/^(?=.*\d)[A-Za-z0-9]{1,8}$/.test(val)) return 'Letters and digits, must include a digit, max 8 characters';
      return '';
    },
    apartmentNumber: (val) => {
      if (val && !/^\d{1,4}$/.test(val)) return 'Only digits, max 4 characters';
      return '';
    },
    city: (val) => {
      if (!val) return 'City is required';
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,80}$/.test(val)) return 'Only letters and spaces, max 80 characters';
      return '';
    },
    postalCode: (val) => {
      if (!val) return 'Postal code is required';
      if (!/^\d{1,3}-\d{1,3}$/.test(val)) return 'Format must be like 12-345';
      return '';
    },
    country: (val) => {
      if (!val) return 'Country is required';
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,80}$/.test(val)) return 'Only letters and spaces, max 80 characters';
      return '';
    }
  };


  const validateField = (name, value) => {
    const error = validators[name] ? validators[name](value) : '';
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };


  const handleSubmit = async () => {
    if (!userId) return;

    const newErrors = Object.fromEntries(
      Object.entries(newAddress).map(([key, val]) => [key, validators[key] ? validators[key](val) : ''])
    );

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);
    if (hasErrors) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,},
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
        <TextField label="First name" name="firstName" value={newAddress.firstName} onChange={handleChange}
         error={Boolean(errors.firstName)} helperText={errors.firstName} />

        <TextField label="Last name" name="lastName" value={newAddress.lastName} onChange={handleChange}
         error={Boolean(errors.lastName)} helperText={errors.lastName}/>

        <TextField label="Email" name="email" value={newAddress.email} onChange={handleChange}
         error={Boolean(errors.email)} helperText={errors.email}/>

        <TextField label="Phone number" name="phoneNumber" value={newAddress.phoneNumber} onChange={handleChange}
         error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber}/>

        <TextField label="Street" name="street" value={newAddress.street} onChange={handleChange}
         error={Boolean(errors.street)} helperText={errors.street}/>

        <TextField label="Building Number" name="buildingNumber" value={newAddress.buildingNumber} onChange={handleChange}
         error={Boolean(errors.buildingNumber)} helperText={errors.buildingNumber}/>

        <TextField label="Apartment number (not required)" name="apartmentNumber" value={newAddress.apartmentNumber} onChange={handleChange}
        error={Boolean(errors.apartmentNumber)} helperText={errors.apartmentNumber}/>

        <TextField label="City" name="city" value={newAddress.city} onChange={handleChange}
         error={Boolean(errors.city)} helperText={errors.city}/>

        <TextField label="Postal code" name="postalCode" value={newAddress.postalCode} onChange={handleChange}
         error={Boolean(errors.postalCode)} helperText={errors.postalCode}/>

        <TextField label="Country" name="country" value={newAddress.country} onChange={handleChange}
         error={Boolean(errors.country)} helperText={errors.country}/>

        <Button variant="contained" onClick={handleSubmit}>
          Add address
        </Button>
      </FormGroup>
    </Box>
  );
};

export default AddressForm;
