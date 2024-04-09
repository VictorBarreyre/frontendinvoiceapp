import React, { useState, useEffect } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

function CardPaymentForm({ clientSecret, montant, invoiceData }) {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);

  useEffect(() => {
    setStripe(loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg'));
  }, []);

  useEffect(() => {
    if (stripe) {
      setElements(stripe.elements());
    }
  }, [stripe]);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen', // Change as needed
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.paymentIntent.status);
    }
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Flex direction='column'>
        <Heading textAlign='end' mb='2rem' size='md'> Total à payer : {montant} {invoiceData.devise}</Heading>
        <form onSubmit={handleSubmit} style={{ padding: '1rem', width: '25vw', border: '1px solid rgba(191, 191, 197, 0.4)', borderRadius: '5px', backgroundColor: '#fdfdfd', boxShadow: 'rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px' }}>
          <CardElement options={cardStyle} />
          <button type="submit" disabled={!stripe}>
            Payer par Carte
          </button>
        </form>
      </Flex>
    </Elements>
  );
}

export default CardPaymentForm;
