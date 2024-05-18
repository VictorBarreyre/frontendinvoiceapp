import React, { useState } from 'react';
import { Heading, Text, Button, Flex } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import { Link, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe("pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg");

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

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { invoiceData, baseUrl } = useInvoiceData();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      }
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        navigate('/payment-success'); // Utilisez `navigate` pour rediriger
      } else {
        navigate('/payment-error'); // Utilisez `navigate` pour rediriger
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ appearance }} />
      <Button mt='2rem' mb='2rem' w={{ base: '100%', lg: 'unset' }}  color='white' borderRadius='30px' backgroundColor='black' type="submit" disabled={!stripe}>
      Payer maintenant
      </Button>
    </form>
  );
};

const SuccessPage = () => {
  const { invoiceData, baseUrl } = useInvoiceData();
  const [showPaywall, setShowPaywall] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const amount = 220;

  const handleCreateSession = async () => {
    try {
      const response = await fetch(`${baseUrl}/paiement/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Montant en centimes
          currency: 'eur', // ou toute autre devise appropriée
          emetteur: JSON.stringify(invoiceData.issuer),
        })
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaywall(true);
      } else {
        console.log('Failed to create payment intent:', data.error);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Heading fontSize={{ base: '24px', lg: '26px' }}>Facture envoyée avec Succès!</Heading>
          <Text>Votre facture a été envoyée avec succès à l'adresse email du destinataire.</Text>
          <Text>Vous pouvez aussi définir des relances de paiement par mail à {invoiceData.client.name}</Text>
          <Text mb='2rem'>  Il vous suffit de régler {amount / 100} {invoiceData.devise} </Text>

          {!showPaywall ? (
            <Button  mt='2rem' mb='2rem' w={{ base: '100%', lg: 'unset' }}  color='white' borderRadius='30px' backgroundColor='black' type="submit" onClick={handleCreateSession}>Payer maintenant</Button>
          ) : (
            <Elements stripe={stripePromise} options={{ appearance }}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          )}

          <Link pt='2rem' to="/">Retour à la page d'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
