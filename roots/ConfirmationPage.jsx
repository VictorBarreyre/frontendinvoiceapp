import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, Heading, Text, Link, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import { Elements, PaymentElement, IbanElement, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import { pdfjs, Document, Page } from 'react-pdf';



const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PaymentForm({ clientSecret, paymentType }) {
  const stripe = useStripe();
  const elements = useElements();



  const {
    invoiceData,
    baseUrl
  } = useInvoiceData();

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

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        '::placeholder': {
          color: '#aab7c4',
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      },
      complete: {
        color: "#00e676"
      },
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
  
    if (paymentType === 'sepa') {
      // Traitement pour SEPA
      const result = await stripe.confirmSepaDebitPayment(clientSecret, {
        payment_method: {
          sepa_debit: elements.getElement(IbanElement),
          billing_details: { name: 'Jenny Rosen' },
        },
      });
      // Gestion des résultats pour SEPA
    } else {
      // Traitement pour les cartes de crédit
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Jenny Rosen' },
        },
      });
      // Gestion des résultats pour les cartes
    }
  };
  

  return (
    <form className='form-iban' onSubmit={handleSubmit}>
      <div className='chakra-input' style={{
  padding: '1rem',
  minWidth: '23rem',
  border: '1px solid rgba(191, 191, 197, 0.4)',
  borderRadius: '5px',
  backgroundColor: '#fdfdfd',
  boxShadow: 'rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgb(255, 255, 255) 1.5px 1.5px 3px 0px',
}}>
  {paymentType === 'sepa' ? (
    <IbanElement options={{ style: ibanStyle, supportedCountries: ['SEPA'] }} />
  ) : (
    <CardElement options={cardStyle} />
  )}
</div>
      <button className='submitButton' type="submit" disabled={!stripe}>
        Envoyer le paiement
      </button>
    </form>

  );
}

function ConfirmationPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [emetteur, setEmetteur] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [urlDeLaFacture, setUrlDeLaFacture] = useState('');
  const [paymentType, setPaymentType] = useState('sepa');



  let query = useQuery();
  let factureId = query.get("facture");
  let montant = query.get("montant"); // Assurez-vous d'ajouter cette ligne si vous passez le montant comme paramètre


  const {
    invoiceData,
    baseUrl
  } = useInvoiceData();


  useEffect(() => {
    const fetchEmailDetails = async () => {
      const factureId = query.get("facture"); // Assurez-vous que cet ID est passé correctement dans l'URL
      if (!factureId) {
        console.error("ID de facture manquant");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/email/details/${factureId}`);

        const data = await response.json();
        if (response.ok) {
          setEmetteur(data.emetteur.name); // Ajustez selon la structure de votre objet
          setDestinataire(data.destinataire.name); // Ajustez selon la structure de votre objet
          setUrlDeLaFacture(data.urlImage);
          console.log(data)

        } else {
          throw new Error(data.message || "Erreur lors de la récupération des détails");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'email:", error);
      }
    };

    fetchEmailDetails();
  }, []); // Vous pouvez ajouter `query` aux dépendances si nécessaire


  useEffect(() => {
    const createPaymentIntent = async () => {
      
      const response = await fetch(`${baseUrl}/paiement/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: montant * 100, // Montant en centimes
          currency: 'eur', // ou toute autre devise appropriée
          emetteur: JSON.stringify(invoiceData.issuer),
          destinataire: JSON.stringify(invoiceData.client)
        })
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, [montant]); // Ajoutez 'emetteur' et 'destinataire' comme dépendances si ces valeurs peuvent changer



  if (!clientSecret) {
    return <div>Chargement...</div>;
  }

  return (


    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Flex direction='column' h='100vh' >
        <Flex alignContent='center' alignItems="center" direction='column' mt="7rem" >
          <Flex borderWidth='1px' className='neue-up' direction='column' alignContent='start' alignItems='start' gap='4px' borderRadius='1vw' backgroundColor='white' p='3rem' w={{ base: '100vw', lg: '65vw' }} >
            <Flex justifyContent='space-between' direction={{ base: 'column', lg: 'row' }} width='100%'>

              <Flex direction='column' h='100%' justifyContent='space-between' w='30vw' pr='2rem' borderRight='2px solid #efefef' >
                <Flex direction='column'>
                  <Heading fontSize='26px' textAlign='start' mb="1rem">Signature et Paiement</Heading>

                  <RadioGroup onChange={setPaymentType} value={paymentType}>
                    <Stack direction="row" mb="4">
                      <Radio value="sepa">Paiement SEPA</Radio>
                      <Radio value="card">Paiement par carte</Radio>
                    </Stack>
                  </RadioGroup>
                  <Text w={{ base: '90vw', lg: 'auto' }} textAlign='start' pt='2' mb="1.5rem">Afin de finaliser la signature de la facture émise par {emetteur},
                    nous avons besoin de votre IBAN. <br /> Votre paiement sera traité avec soin et en respectant les échéances convenues dans nos termes contractuels. <br /> Merci !
                  </Text>
                  <Text w={{ base: '90vw', lg: 'auto' }} textAlign='start' pt='2' mb="1.5rem" color='#718096'>
                    Veillez à bien déténir la totalité des fonds sur le compte bancaire correspondant.
                    Toutes défaillances pourraient vous être facturée. <br /> <Link color='#745FF2' fontSize='13px' textDecor='underline'> En savoir plus sur notre politique de transactions défaillantes</Link>
                  </Text>
                </Flex>

                <Flex direction='column'>
                  <Heading textAlign='start' mb='2rem' size='md'> Total à payer : {montant} {invoiceData.devise}</Heading>
                  <PaymentForm clientSecret={clientSecret} paymentType={paymentType} />
                </Flex>

              </Flex>

              <Flex className='neue-up' backgroundColor='#fdfdfd' width='25vw' height='30rem' p='0.2rem' borderWidth='1px' borderRadius='1rem'>
                {urlDeLaFacture.endsWith('.pdf') ? (
                  <Document file={urlDeLaFacture}>
                    <Page pageNumber={1} />
                  </Document>
                ) : (
                  <img src={urlDeLaFacture} alt="Aperçu de la Facture" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
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