import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box, Input } from '@chakra-ui/react';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const SubscribeForm = ({ priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const { baseUrl } = useInvoiceData();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Créer un payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: email,
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    // Appeler le backend pour créer un abonnement
    const response = await fetch(`${baseUrl}/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        payment_method: paymentMethod.id,
        priceId: priceId,
      }),
    });

    const subscription = await response.json();

    if (subscription.error) {
      console.error(subscription.error.message);
      return;
    }

    const { clientSecret } = subscription;

    const result = await stripe.confirmCardPayment(clientSecret);

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Subscription succeeded');
        // Rediriger vers une page de succès ou afficher un message de succès
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
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
        type="Nom et prénom"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nom et prénom"
        required
        mb='2rem'
      />
      <Box mb={4}>
        <CardElement />
      </Box>
      <Button mt='2rem' mb='2rem' w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black' disabled={!stripe}>
        Souscrire
      </Button>
    </form>
  );
};

export default SubscribeForm;
