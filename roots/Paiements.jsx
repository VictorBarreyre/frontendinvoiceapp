import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Link,
} from '@chakra-ui/react';
import { CheckCircleIcon, CheckIcon } from '@chakra-ui/icons';
import SubscribeForm from '../src/components/SubcribeForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');

const Paiements = () => {
  const { user } = useAuth();
  const { checkActiveSubscription, createSubscription, baseUrl } = useInvoiceData();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [product, setProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const {invoiceData} = useInvoiceData()

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user && user.email) {
        const hasActiveSubscription = await checkActiveSubscription(user.email);
        setSubscriptionStatus(hasActiveSubscription ? 'Actif' : 'Inactif');
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user, checkActiveSubscription]);

  useEffect(() => {
    const fetchProductsAndPrices = async () => {
      try {
        const response = await fetch(`${baseUrl}/abonnement/products-and-prices`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const targetProduct = data.find(p => p.name === 'Premium'); // Remplacez 'Premium' par le nom de votre produit
        setProduct(targetProduct);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsAndPrices();
  }, [baseUrl]);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!product || !user || clientSecret) return;

      try {
        const onSuccess = (clientSecret) => {
          setClientSecret(clientSecret);
        };
        const onError = () => {
          console.error('Error creating subscription');
        };

        const selectedPriceId = selectedPlan === 'monthly' ? product.prices.find(price => price.recurring?.interval === 'month').id : product.prices.find(price => price.recurring?.interval === 'year').id;
        
        await createSubscription(user.email, selectedPriceId, onSuccess, onError);
      } catch (error) {
        console.error('Error creating subscription:', error);
      }
    };

    fetchClientSecret();
  }, [product, user, clientSecret, selectedPlan, createSubscription]);

  if (loading) {
    return (
      <Box className='neue-up' borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
        <Flex p='3rem' direction='column' alignItems='center' justifyContent='center'>
          <Spinner size='xl' />
        </Flex>
      </Box>
    );
  }

  if (!product) {
    return <Text>Aucun produit trouvé.</Text>;
  }

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

  const monthlyPrice = product.prices.find(price => price.recurring?.interval === 'month');
  const yearlyPrice = product.prices.find(price => price.recurring?.interval === 'year');
  const selectedPriceId = selectedPlan === 'monthly' ? monthlyPrice.id : yearlyPrice.id;

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column'>
            <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>
              Abonnement
            </Heading>

            {subscriptionStatus === 'Actif' ? (
              <Text color='green.500'>Votre abonnement est actuellement actif.</Text>
            ) : (
              <>
                <Text color='red.500'>Vous n'avez pas d'abonnement actif.</Text>
                <Text>Vous pouvez le renouveler en choisissant la formule ci-dessous</Text>
                <Flex direction={{ base: 'column-reverse', lg: 'unset' }} justifyContent='space-between' alignItems='start' mt='3rem'>
                  <Flex  direction='column' w={{ base: '100%', lg: '50%' }} gap='15px'>
                    <Heading size="sm">Vos informations</Heading>
                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                        <SubscribeForm clientSecret={clientSecret} setClientSecret={setClientSecret} selectedPriceId={selectedPriceId} />
                      </Elements>
                    ) : (
                      <Spinner size='md' />
                    )}
                  </Flex>
                  <Flex direction='column' w={{ base: '100%', lg: '45%' }} mb={{ base: '3rem', lg: 'unset' }} justify="center" gap='15px'>
                    <Heading size="sm">Votre abonnement premium</Heading>
                    <Accordion allowToggle>
                      {monthlyPrice && (
                        <AccordionItem
                          w='100%'
                          className='neue-up'
                          borderWidth="1px"
                          backgroundColor='#fdfdfd'
                          borderColor={selectedPlan === 'yearly' ? 'inherit' : '#745FF2'}
                          borderRadius="lg"
                          overflow="hidden"
                          pt='0.5rem'
                          pb='0.5rem'
                          pr='1rem'
                          opacity={selectedPlan === 'yearly' ? 0.6 : 1}
                          onClick={() => setSelectedPlan('monthly')}
                          cursor="pointer"
                        >
                          <AccordionButton _hover={{ boxShadow: 'none' }} onClick={() => setSelectedPlan('monthly')}>
                            <Flex alignItems='center' w='100%' gap='15px'>
                              <CheckCircleIcon color='white' backgroundColor={selectedPlan === 'yearly' ? 'white' : '#745FF2'} borderColor='#745FF2' borderRadius='100px' borderWidth='1px' />
                              <Box flex="1" textAlign="left">
                                <Heading color={selectedPlan === 'yearly' ? 'inherit' : '#745FF2'} fontSize="md" mb='0.5rem'>Paiement mensuel</Heading>
                                <Heading size="sm">
                                  {monthlyPrice.unit_amount / 100} {invoiceData.devise} / Mois
                                </Heading>
                                <Text color='' fontSize="14px">
                                  Premier mois gratuit
                                </Text>
                              </Box>
                              <AccordionIcon />
                            </Flex>
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <List pt='1.5rem' borderTopWidth='1px' spacing={3}>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                {product.description}
                              </ListItem>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                Assumenda, quia temporibus eveniet a libero incidunt suscipit
                              </ListItem>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                              </ListItem>
                            </List>
                          </AccordionPanel>
                        </AccordionItem>
                      )}
                    </Accordion>

                    <Accordion allowToggle>
                      {yearlyPrice && (
                        <AccordionItem
                          w='100%'
                          className='neue-up'
                          borderWidth="1px"
                          backgroundColor='#fdfdfd'
                          borderColor={selectedPlan === 'monthly' ? 'inherit' : '#745FF2'}
                          borderRadius="lg"
                          overflow="hidden"
                          pt='0.5rem'
                          pb='0.5rem'
                          pr='1rem'
                          opacity={selectedPlan === 'monthly' ? 0.6 : 1}
                          onClick={() => setSelectedPlan('yearly')}
                          cursor="pointer"
                        >
                          <AccordionButton _hover={{ boxShadow: 'none' }} onClick={() => setSelectedPlan('yearly')}>
                            <Flex alignItems='center' w='100%' gap='20px'>
                              <CheckCircleIcon color='white' backgroundColor={selectedPlan === 'monthly' ? 'white' : '#745FF2'} borderColor='#745FF2' borderRadius='100px' borderWidth='1px' />
                              <Box flex="1" textAlign="left">
                                <Heading color={selectedPlan === 'monthly' ? 'inherit' : '#745FF2'} fontSize="md" mb='0.5rem'>Paiement annuel</Heading>
                                <Heading size="sm">
                                  {yearlyPrice.unit_amount / 100} {invoiceData.devise} / An
                                </Heading>
                                <Text fontSize="14px">
                                  Deux mois gratuits
                                </Text>
                              </Box>
                              <AccordionIcon />
                            </Flex>
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <List pt='1.5rem' borderTopWidth='1px' spacing={3}>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                {product.description}
                              </ListItem>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                Assumenda, quia temporibus eveniet a libero incidunt suscipit
                              </ListItem>
                              <ListItem>
                                <ListIcon as={CheckIcon} color='#745FF2' />
                                Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                              </ListItem>
                            </List>
                          </AccordionPanel>
                        </AccordionItem>
                      )}
                    </Accordion>
                    <Text color='#4A5568' fontSize="14px"> En continuant, vous acceptez <Link color='#745FF2'> nos termes et conditions.</Link></Text>
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default Paiements;
