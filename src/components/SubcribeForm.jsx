import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Button, Box, Input, Flex } from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { loadStripe } from '@stripe/stripe-js';
import CountrySelector from './CountrySelector';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const SubscribeForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { invoiceData, createCheckoutSession } = useInvoiceData();
    const [email, setEmail] = useState(invoiceData.issuer.email);
    const [name, setName] = useState(invoiceData.issuer.name);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (email && name) {
            createCheckoutSession(email, name, (clientSecret) => {
                console.log(`Checkout session created: ${clientSecret}`);
                setClientSecret(clientSecret);
            }, () => {
                console.error('Error creating checkout session');
            });
        }
    }, [email, name]);

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                mb='1rem'
            />
            <Input
                className='neue-down'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom et prénom"
                required
                mb='1rem'
            />
            <Input
                className='neue-down'
                type="text"
                value={invoiceData.issuer.adresse}
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
            >
                Profiter de l'offre
            </Button>
        </form>
    );
};

export default SubscribeForm;
