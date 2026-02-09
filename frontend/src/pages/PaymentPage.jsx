import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentComponent from '../components/PaymentComponent';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const stripePromise = loadStripe('pk_test_51RYuty2eycwVrWGGhHsrLBiPObcS3SIhC6NtMcUMwFz7ImDlk3a6MzP7K2ju6MXDdpJvan2USXIozP80YmiybR4Q00FgdL0sqD');

export default function PaymentPage() {
    const { orderId } = useParams();
    const [clientSecret, setClientSecret] = useState(null);
    const location = useLocation();
    const amount = location.state?.amount;
    const { t } = useTranslation();

    const token = localStorage.getItem('token');
    useEffect(() => {
        fetch(`http://localhost:8080/orders/${orderId}/stripe-payment?amount=${amount}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
        })
        .then(async res => {
            const text = await res.text();

            if (!res.ok) throw new Error('Błąd pobierania danych Stripe: ' + text);

            return JSON.parse(text);
        })
        .then(data => setClientSecret(data.clientSecret))
        .catch(err => console.error(err));
    }, [orderId, amount]);

    if (!clientSecret) return <p>{t('loadingPayment')}</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentComponent
                clientSecret={clientSecret}
                orderId={orderId}
                amount={amount}
                description="Zakup gier"
            />
        </Elements>
    );
}
