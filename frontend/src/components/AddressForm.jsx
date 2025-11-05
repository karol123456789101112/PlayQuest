import React, { useState } from 'react';
import {
  Box, TextField, FormGroup, Button, Typography
} from '@mui/material';
import { useTranslation} from 'react-i18next';
import '../i18n';

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
  const { t, i18n } = useTranslation();

  const validators = {
    firstName: (val) => {
      if (!val) return t('firstNameIsRequired');
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{1,40}$/.test(val)) return t('firstNameValid');
      return '';
    },
    lastName: (val) => {
      if (!val) return t('lastNameIsRequired');
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\- ]{1,80}$/.test(val)) return t('lastNameValid');
      return '';
    },
    email: (val) => {
      if (!val) return t('emailIsRequired');;
      if (!/^\S+@\S+\.\S+$/.test(val)) return t('emailValid');
      return '';
    },
    phoneNumber: (val) => {
      if (!val) return t('phoneNumberIsRequired');
      if (!/^\d{9,10}$/.test(val)) return t('phoneNumberValid');
      return '';
    },
    street: (val) => {
      if (!val) return t('streetIsRequired');
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\- ]{1,80}$/.test(val)) return t('streetValid');
      return '';
    },
    buildingNumber: (val) => {
      if (!val) return t('buildingNumberIsRequired');
      if (!/^(?=.*\d)[A-Za-z0-9]{1,8}$/.test(val)) return t('buildingNumberValid');
      return '';
    },
    apartmentNumber: (val) => {
      if (val && !/^\d{1,4}$/.test(val)) return t('apartmentNumberValid');
      return '';
    },
    city: (val) => {
      if (!val) return t('cityIsRequired');
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,80}$/.test(val)) return t('cityValid');
      return '';
    },
    postalCode: (val) => {
      if (!val) return t('postalCodeIsRequired');
      if (!/^\d{1,3}-\d{1,3}$/.test(val)) return t('postalCodeValid');
      return '';
    },
    country: (val) => {
      if (!val) return t('countryIsRequired');
      if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ ]{1,80}$/.test(val)) return t('countryValid');
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
      alert(t('addressAdded'));
    } catch (error) {
      alert(t('errorWhileAddingAddress') + error.message);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6">{t('addNewAddress')}</Typography>
      <FormGroup sx={{ gap: 2, mt: 2 }}>
        <TextField label={t('firstName')} name="firstName" value={newAddress.firstName} onChange={handleChange}
         error={Boolean(errors.firstName)} helperText={errors.firstName} />

        <TextField label={t('lastName')} name="lastName" value={newAddress.lastName} onChange={handleChange}
         error={Boolean(errors.lastName)} helperText={errors.lastName}/>

        <TextField label={t('email')} name="email" value={newAddress.email} onChange={handleChange}
         error={Boolean(errors.email)} helperText={errors.email}/>

        <TextField label={t('phoneNumber')} name="phoneNumber" value={newAddress.phoneNumber} onChange={handleChange}
         error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber}/>

        <TextField label={t('street')} name="street" value={newAddress.street} onChange={handleChange}
         error={Boolean(errors.street)} helperText={errors.street}/>

        <TextField label={t('buildingNumber')} name="buildingNumber" value={newAddress.buildingNumber} onChange={handleChange}
         error={Boolean(errors.buildingNumber)} helperText={errors.buildingNumber}/>

        <TextField label={t('apartmentNumber')} name="apartmentNumber" value={newAddress.apartmentNumber} onChange={handleChange}
        error={Boolean(errors.apartmentNumber)} helperText={errors.apartmentNumber}/>

        <TextField label={t('city')} name="city" value={newAddress.city} onChange={handleChange}
         error={Boolean(errors.city)} helperText={errors.city}/>

        <TextField label={t('postalCode')} name="postalCode" value={newAddress.postalCode} onChange={handleChange}
         error={Boolean(errors.postalCode)} helperText={errors.postalCode}/>

        <TextField label={t('country')} name="country" value={newAddress.country} onChange={handleChange}
         error={Boolean(errors.country)} helperText={errors.country}/>

        <Button variant="contained" onClick={handleSubmit}>
          {t('addAddress')}
        </Button>
      </FormGroup>
    </Box>
  );
};

export default AddressForm;
