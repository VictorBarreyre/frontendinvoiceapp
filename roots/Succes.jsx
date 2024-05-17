import React, { useState } from 'react';
import { Heading, Text, Button } from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import { Link, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe("pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg");

const CheckoutForm = ({ sessionId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { invoiceData, baseUrl } = useInvoiceData();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const { paymentMethod } = result;
      fetch(`${baseUrl}/paiement/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: 220 }), // Assurez-vous que le montant est en centimes
      }).then(response => response.json())
        .then(data => {
          if (data.success) {
            navigate('/payment-success'); // Utilisez `navigate` pour rediriger
          } else {
            navigate('/payment-error'); // Utilisez `navigate` pour rediriger
          }
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe}>
        Pay
      </Button>
    </form>
  );
};

const SuccessPage = () => {
  const { invoiceData, baseUrl } = useInvoiceData();
  const [showPaywall, setShowPaywall] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const amount = 220;

  const handleCreateSession = async () => {
    try {
      const response = await fetch(`${baseUrl}/paiement/create-checkout-session`, {
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

      if (data.sessionId) {
        setSessionId(data.sessionId);
        setShowPaywall(true);
      } else {
        console.log('Failed to create checkout session:', data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
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
            <Button onClick={handleCreateSession}>Payer maintenant</Button>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm sessionId={sessionId} />
            </Elements>
          )}

          <Link pt='2rem' to="/">Retour à la page d'accueil</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
