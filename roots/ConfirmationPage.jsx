import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, Heading, Text, Link, Button, FormControl } from '@chakra-ui/react';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import { Elements, PaymentElement, IbanElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaymentForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const ibanStyle = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      '::placeholder': {
        color: '#aab7c4',
        fontSize: "16px",
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    },
    complete: {
      color: "#00e676"
    },

  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmSepaDebitPayment(clientSecret, {
      payment_method: {
        sepa_debit: elements.getElement(IbanElement),
        billing_details: {
          name: 'Jenny Rosen',
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
    <form className='form-iban' onSubmit={handleSubmit}>
      <div className='chakra-inpu' style={{
        padding: '1rem',
        minWidth: '23rem',
        border: '1px solid rgba(191, 191, 197, 0.4) ',
        borderRadius: '5px',
        backgroundColor: '#fdfdfd',
        boxShadow: 'rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px',
      }}>
        <IbanElement options={{
          style: {
            base: {
              color: '#fff',
              fontWeight: '500',
              fontFamily: 'SF Pro Display',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            complete: {
              color: "#00e676"
            }
          },
          supportedCountries: ['SEPA']
        }} />
      </div>
      <button className='submitButton' type="submit" disabled={!stripe}>
        Envoyer le mandat de prélèvement SEPA
      </button>
    </form>

  );
}

function ConfirmationPage() {
  const [clientSecret, setClientSecret] = useState('');
  let query = useQuery();
  let factureId = query.get("facture");
  let montant = query.get("montant"); // Assurez-vous d'ajouter cette ligne si vous passez le montant comme paramètre
  let emetteur = query.get("emetteur");

  const {
    invoiceData,
  } = useInvoiceData();


  useEffect(() => {
    // Votre code existant pour créer l'intention de paiement
    // Assurez-vous d'utiliser le montant correct ici
    const createPaymentIntent = async () => {
      const response = await fetch('http://localhost:8000/paiement/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: montant * 100 }), // Assurez-vous que votre backend attend un montant en centimes
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      console.log(emetteur)
    };

    createPaymentIntent();
  }, [montant]); // Ajoutez montant comme dépendance pour useEffect


  if (!clientSecret) {
    return <div>Chargement...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Flex direction='column' h='100vh' >
        <Flex alignContent='center' alignItems="center" direction='column' mt="7rem" >
          <Flex borderWidth='1px' className='neue-up' direction='column' alignContent='start' alignItems='start' gap='4px' borderRadius='1vw' backgroundColor='white' p='3rem' w={{ base: '100vw', lg: '65vw' }} >
            <Flex justifyContent='space-between' direction={{ base:'column', lg :'row'}} width='100%'>

              <Flex direction='column' h='100%' justifyContent='space-between' w='30vw' pr='2rem' borderRight='2px solid #efefef' >
                <Flex direction='column'>
                  <Heading fontSize='26px' textAlign='start' mb="1rem">Signature et Paiement</Heading>
                  <Text w={{ base: '90vw', lg: 'auto' }} textAlign='start' pt='2' mb="1.5rem">Afin de finaliser la signature de la facture n°{invoiceData.number} émise par {emetteur},
                    nous avons besoin de votre IBAN. <br /> Votre paiement sera traité avec soin et en respectant les échéances convenues dans nos termes contractuels. <br /> Merci !
                  </Text>
                  <Text w={{ base: '90vw', lg: 'auto' }} textAlign='start' pt='2' mb="1.5rem" color='#718096'>
                    Veillez à bien déténir la totalité des fonds sur le compte bancaire correspondant.
                    Toutes défaillances pourraient vous être facturée. <br/> <Link color='#745FF2' fontSize='13px' textDecor='underline'> En savoir plus sur notre politique de transactions défaillantes</Link>
                  </Text>
                  </Flex>

                <Flex direction='column'> 
                  <Heading  textAlign='start' mb='2rem' size='md'> Total à payer : {montant} {invoiceData.devise}</Heading>
                  <PaymentForm clientSecret={clientSecret} />
                </Flex>
          
              </Flex>

              <Flex className='neue-up' backgroundColor='#fdfdfd' opacity='40%' width='25vw' height='30rem' borderWidth='1px' borderRadius='1rem'>
              </Flex>

            </Flex>
          </Flex>
        </Flex>
        <Flex alignItems='center' alignContent='center' justifyContent='center' direction='column'>
          <Text color='#718096' fontSize={{ base: '13px', lg: 'unset' }} lineHeight={{ base: '16px', lg: 'unset' }} w={{ base: '95vw', lg: '65vw' }} p={{ base: '1rem', lg: '3rem' }} textAlign='center'> Veuillez noter que le paiement de cette facture constitue une acceptation des termes et conditions du contrat établi
            entre Jean Dupont et Victor Barreyre. Vous trouverez les détails concernant la procédure d'acceptation et de signature
            du contrat dans l'email accompagnant cette facture.</Text>
        </Flex>
      </Flex>
    </Elements>
  );
}

export default ConfirmationPage; 