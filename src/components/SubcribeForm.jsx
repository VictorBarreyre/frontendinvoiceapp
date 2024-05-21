import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Button, Box, Input, Flex } from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const SubscribeForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { invoiceData, createCheckoutSession } = useInvoiceData();
    const [email, setEmail] = useState(invoiceData.issuer.email);
    const [name, setName] = useState(invoiceData.issuer.name);
    const [address, setAddress] = useState(invoiceData.issuer.adresse);
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [isSessionCreated, setIsSessionCreated] = useState(false);

    useEffect(() => {
        if (email && name && !isSessionCreated) {
            createCheckoutSession(email, name, (clientSecret) => {
                console.log(`Checkout session created: ${clientSecret}`);
                setClientSecret(clientSecret);
                setIsSessionCreated(true);
                console.log('Client Secret:', clientSecret); // Ajout du console.log ici
            }, () => {
                console.error('Error creating checkout session');
            });
        }
    }, [email, name, isSessionCreated, createCheckoutSession]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Stripe:', stripe);
        console.log('Elements:', elements);
        console.log('Client Secret at submission:', clientSecret); // Ajout du console.log ici

        if (!stripe || !elements) {
            console.error('Stripe.js has not yet loaded.');
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

    const stripeAppearance = {
        theme: 'flat',
        variables: {
            fontFamily: 'SF Pro Display, sans-serif',
        },
        rules: {
            '.Label': {
                'fontSize': 'SF Pro Display, sans-serif',
                'fontWeight': '600',
                'marginBottom': '0.5rem',
            },
            '.Input': {
                'backgroundColor': '#fdfdfd',
                'border': '1px solid #E2E8F0',
                'boxShadow': 'rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px',
                'borderRadius': '4px',
                'padding': '10px',
            },
        },
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Adresse"
                required
                mb='1rem'
            />
            <Flex gap='10px'>
                <Input
                    className='neue-down'
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Pays"
                    required
                    mb='2rem'
                />
                <Input
                    className='neue-down'
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Code Postal"
                    required
                    mb='2rem'
                />
            </Flex>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                    <Box mb={4}>
                        <PaymentElement />
                    </Box>
                </Elements>
            )}
            <Button
                type="submit"
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
