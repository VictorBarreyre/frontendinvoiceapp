import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, Input, Flex } from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';

const SubscribeForm = ({ clientSecret, setClientSecret, selectedPriceId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { invoiceData, createSubscription } = useInvoiceData();
    const [email, setEmail] = useState(invoiceData.issuer.email);
    const [name, setName] = useState(invoiceData.issuer.name);
    const [address, setAddress] = useState(invoiceData.issuer.adresse);
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe.js has not yet loaded.');
            return;
        }

        const onSuccess = (clientSecret) => {
            setClientSecret(clientSecret);
        };
        const onError = () => {
            console.error('Error creating subscription');
        };

        await createSubscription(invoiceData.issuer.email, selectedPriceId, onSuccess, onError);

        const result = await stripe.confirmSetup({
            elements,
            confirmParams: { return_url: `${window.location.origin}/success` },
        });

        if (result.error) {
            console.error(result.error.message);
        } else {
            if (result.setupIntent.status === 'succeeded') {
                console.log('SetupIntent succeeded');
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
            <Box mb={4}>
                <PaymentElement />
            </Box>
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
