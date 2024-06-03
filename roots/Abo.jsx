import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Flex,
  Text,
  Box,
  Spinner,
  List,
  ListItem,
  ListIcon,
  Link,
} from '@chakra-ui/react';
import { CheckCircleIcon, CheckIcon } from '@chakra-ui/icons';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import SubscribeForm from '../src/components/SubcribeForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const Abo = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { invoiceData, baseUrl, createCheckoutSession, sendButtonClicked } = useInvoiceData();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [clientSecret, setClientSecret] = useState('');
  const [isCheckoutSessionCreated, setIsCheckoutSessionCreated] = useState(false);

  useEffect(() => {
    const fetchProductsAndPrices = async () => {
      try {
        const response = await fetch(`${baseUrl}/abonnement/products-and-prices`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const targetProduct = data.find(p => p.name === 'Premium'); // Replace 'Premium' with the product name you want to display
        setProduct(targetProduct);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProductsAndPrices();
  }, [baseUrl]);

  useEffect(() => {
    const fetchClientSecret = async () => {
        if (isCheckoutSessionCreated) return;
        setIsCheckoutSessionCreated(true);

        try {
            const selectedPriceId = selectedPlan === 'monthly' 
                ? product.prices.find(price => price.recurring?.interval === 'month').id 
                : product.prices.find(price => price.recurring?.interval === 'year').id;
            
            await createCheckoutSession(
                invoiceData.issuer.email, 
                invoiceData.issuer.name, 
                selectedPriceId, 
                (clientSecret) => setClientSecret(clientSecret), 
                (error) => console.error('Error creating checkout session', error)
            );
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    if (product && !clientSecret) {
        fetchClientSecret();
    }
}, [createCheckoutSession, product, invoiceData.issuer.email, invoiceData.issuer.name, selectedPlan, clientSecret, isCheckoutSessionCreated]);

  

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <Spinner color='#745FF2' size="md" />
      </div>
    );
  }

  if (!product) {
    return <Text>Aucun produit trouvé.</Text>;
  }

  const monthlyPrice = product.prices.find(price => price.recurring?.interval === 'month');
  const yearlyPrice = product.prices.find(price => price.recurring?.interval === 'year');
  const selectedPriceId = selectedPlan === 'monthly' ? monthlyPrice.id : yearlyPrice.id;
  console.log(selectedPriceId);

  const titleAbo = () => {
    if (sendButtonClicked === 'sendInvoice') {
      return "Texte pour envoyer la facture";
    }
    return "Choisissez votre formule d'abonnement";
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
      '.Tab': {
        'backgroundColor': '#fdfdfd',
        'border': '1px solid #e2e8f0',
        'borderRadius': '0.4rem',
      },
      '.Tab--selected': {
        'backgroundColor': '#745FF2',
        'borderColor': '#745FF2',
      },
    },
  };

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction="column">
            <Heading fontSize={{ base: '24px', lg: '26px' }} mb='1rem'>{titleAbo()}</Heading>
            <Text color='#4A5568' w='100%' mb='3rem'>
              Nous respectons votre choix de ne pas accepter les cookies. Pour une expérience optimale,
              découvrez notre formule premium. Vous pouvez également accepter les cookies pour accéder gratuitement à notre contenu.
              Après votre abonnement, vous recevrez un e-mail avec un récapitulatif et un mot de passe provisoire à modifier dans votre espace profil.
            </Text>
            <Flex direction={{ base: 'column-reverse', lg: 'unset' }} justifyContent='space-between' alignItems='start'>
              <Flex direction='column' w={{ base: '100%', lg: '50%' }} gap='15px'>
                <Heading size="sm">Vos informations</Heading>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                    <SubscribeForm clientSecret={clientSecret} selectedPriceId={selectedPriceId} />
                  </Elements>
                ) : (
                  <p>Loading...</p>
                )}
              </Flex>
              <Flex direction='column' w={{ base: '100%', lg: '45%' }} mb={{ base: '3rem', lg: 'unset' }} justify="center" gap='15px'>
                <Heading size="sm">Votre abonnement premium</Heading>
                <Accordion allowToggle defaultIndex={[0]}>
                  <AccordionItem borderRadius="md" borderWidth="1px" borderColor="gray.200" p='1rem'>
                    <AccordionButton onClick={() => setSelectedPlan('monthly')}>
                      <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="xl">
                        {product.name} (Monthly)
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        {product.features.map((feature, index) => (
                          <ListItem key={index}>
                            <ListIcon as={CheckIcon} color="green.500" />
                            {feature}
                          </ListItem>
                        ))}
                      </List>
                      <Text fontWeight="bold" mt="1rem">{monthlyPrice.unit_amount / 100} {monthlyPrice.currency.toUpperCase()} / month</Text>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem borderRadius="md" borderWidth="1px" borderColor="gray.200" p='1rem'>
                    <AccordionButton onClick={() => setSelectedPlan('yearly')}>
                      <Box flex="1" textAlign="left" fontWeight="semibold" fontSize="xl">
                        {product.name} (Yearly)
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <List spacing={3}>
                        {product.features.map((feature, index) => (
                          <ListItem key={index}>
                            <ListIcon as={CheckIcon} color="green.500" />
                            {feature}
                          </ListItem>
                        ))}
                      </List>
                      <Text fontWeight="bold" mt="1rem">{yearlyPrice.unit_amount / 100} {yearlyPrice.currency.toUpperCase()} / year</Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Abo;
