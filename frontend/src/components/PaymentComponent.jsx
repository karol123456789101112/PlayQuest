import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PaymentComponent({ clientSecret, orderId, amount, description }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!stripe || !elements || !clientSecret){
      if(!stripe)
              console.log("stripe nie dziala")
            if(!clientSecret)
              console.log("clientSecret nie dziala")
      return;
      }

      if(!stripe)
        console.log("stripe nie dziala")
      if(!clientSecret)
        console.log("clientSecret nie dziala")
      console.log({ orderId, amount, description, clientSecret, stripe});

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert('Błąd płatności: ' + result.error.message);
      } else {
        try {
          const token = localStorage.getItem('token');

          const response = await fetch(`http://localhost:8080/orders/payment/success/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
          });

          if (!response.ok) {
            throw new Error('Błąd zapisu wydatku');
          }

          alert('Płatność zakończona!');
          navigate(`/`);

        } catch (err) {
          console.error(err);
          alert('Płatność zakończona, ale nie udało się zapisać wydatku.');
        }
      }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: 400 }}>
            <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#32325d',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: {
                                color: '#fa755a',
                            },
                        },
                        hidePostalCode: true
                    }}
                />
            </Box>
            <Button type="submit" variant="contained" disabled={!stripe || !clientSecret}>
                {t('pay')}
            </Button>
        </Box>
    );
}