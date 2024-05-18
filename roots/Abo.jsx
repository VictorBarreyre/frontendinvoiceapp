import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Button, Heading, Flex, Text } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import { useInvoiceData } from '../src/context/InvoiceDataContext';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const appearance = {
  theme: 'flat',
  variables: {
    fontFamily: ' "Gill Sans", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '10px',
    colorBackground: '#F6F8FA',
    accessibleColorOnColorPrimary: '#262626'
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px'
    },
    '.Input': {
      padding: '12px'
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray'
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none'
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)'
    },
    '.Label': {
      fontWeight: '500'
    }
  }
};

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const { invoiceData, baseUrl } = useInvoiceData();

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
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        style={{ marginBottom: '20px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <div style={{ marginBottom: '20px' }}>
        <CardElement options={{ appearance }} />
      </div>
      <Button mt='2rem' mb='2rem' w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black' type="submit" disabled={!stripe}>
        Souscrire
      </Button>
    </form>
  );
};

const Abo = () => {
  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Heading fontSize={{ base: '24px', lg: '26px' }}>Abonnez-vous</Heading>
          <Text mb='2rem'>Souscrivez à notre service pour bénéficier de nos offres.</Text>
          <Elements stripe={stripePromise} options={{ appearance }}>
            <SubscribeForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Abo;
