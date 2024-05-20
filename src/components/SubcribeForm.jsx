import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, Input, Flex } from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { loadStripe } from '@stripe/stripe-js';
import CountrySelector from './CountrySelector';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const SubscribeForm = ({ priceId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const { invoiceData, baseUrl } = useInvoiceData();

    useEffect(() => {
        if (email && priceId) {
            const fetchClientSecret = async () => {
                const response = await fetch(`${baseUrl}/abonnement/create-subscription`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, priceId: priceId }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    console.error('Error:', errorResponse);
                    return;
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
                console.log(clientSecret)
                console.log(email)
                console.log(priceId)
            };

            fetchClientSecret();
        }
    }, [ email, priceId]);

    const handleCheckout = async () => {
        const response = await fetch(`${baseUrl}/abonnement/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId: priceId }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error:', errorResponse);
            return;
        }

        const { sessionId } = await response.json();
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error('Error redirecting to checkout:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
            redirect: 'if_required',
        });

        if (result.error) {
            console.error(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Subscription succeeded');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Input
                className='neue-down'
                type="email"
                value={invoiceData.issuer.email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                mb='1rem'
            />
            <Input
                className='neue-down'
                type="text"
                placeholder="Nom et prénom"
                required
                mb='1rem'
            />
            <Input
                className='neue-down'
                type="text"
                placeholder="Adresse"
                required
                mb='1rem'
            />
            <Flex gap='10px'>
                <Input
                    className='neue-down'
                    type="text"
                    placeholder="Pays"
                    required
                    mb='2rem'
                />
                <Input
                    className='neue-down'
                    type="text"
                    placeholder="Code Postal"
                    required
                    mb='2rem'
                />
            </Flex>
            {clientSecret && (
                <Box mb={4}>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentElement />
                    </Elements>
                </Box>
            )}
            <Button
                mt='2rem'
                mb='2rem'
                w={{ base: '100%', lg: 'unset' }}
                color='white'
                borderRadius='30px'
                backgroundColor='black'
                disabled={!stripe || !clientSecret}
                onClick={handleCheckout}
            >
                Profiter de l'offre
            </Button>
        </form>
    );
};

export default SubscribeForm;
