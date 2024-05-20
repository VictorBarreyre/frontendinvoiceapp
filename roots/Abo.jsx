import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
    Heading,
    Flex,
    Text,
    Box,
    Spinner,
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@chakra-ui/icons';
import { useInvoiceData } from '../src/context/InvoiceDataContext';



const Abo = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { baseUrl } = useInvoiceData();
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${baseUrl}/abonnement/products-and-prices`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const targetProduct = data.find(p => p.name === 'Premium'); // Remplacez 'Premium' par le nom du produit que vous souhaitez afficher
                setProduct(targetProduct);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [baseUrl]);

    const handleSubscribeClick = () => {
        navigate('/checkout', { state: { priceId: selectedPriceId } });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                <Spinner color='#745FF2' size="md" />
            </div>)
            ;
    }

    if (!product) {
        return <Text>Aucun produit trouvé.</Text>;
    }
    const monthlyPrice = product.prices.find(price => price.recurring?.interval === 'month');
    const yearlyPrice = product.prices.find(price => price.recurring?.interval === 'year');
    const selectedPriceId = selectedPlan === 'monthly' ? monthlyPrice.id : yearlyPrice.id;


    return (
        <div className='flex-stepper'>
            <div className="stepper-container">
                <div className="tabs-container">
                    <Flex direction="column" alignItems="center">
                        <Heading fontSize={{ base: '24px', lg: '26px' }} mb='1rem'>Choississez votre formule d'abonnements</Heading>
                        <Text w='70%' textAlign='center' mb='2rem'>
                            Une fois votre abonnement créé, nous vous enverrons un e-mail contenant un récapulatif de votre formule <br />
                            et un mot de passe provisoire que nous vous invitons à modifier dans votre espace profil.
                        </Text>
                        <Flex direction='column' w='25rem' justify="center" gap='20px'>
                            <Accordion  allowToggle>
                                {monthlyPrice && (
                                    <AccordionItem     
                                    className='neue-up'
                                    borderWidth="1px"
                                    backgroundColor='#fdfdfd'
                                    borderColor={selectedPlan === 'yearly' ? 'inherit' : '#745FF2'}
                                    borderRadius="lg"
                                    overflow="hidden"
                                    pt='0.5rem' 
                                    pb='0.5rem' 
                                    pl='1rem' 
                                    pr='1rem'
                                  
                                    maxW="sm"
                                    opacity={selectedPlan === 'yearly' ? 0.6 : 1}
                                    onClick={() => setSelectedPlan('monthly')}
                                    cursor="pointer">
                                        <AccordionButton _hover={{ boxShadow: 'none' }} onClick={() => setSelectedPlan('monthly')}>
                                            <Box flex="1" textAlign="left">
                                                <Heading color={selectedPlan === 'yearly' ? 'inherit' : '#745FF2'} fontSize="xl" mb={4}>Paiement mensuel</Heading>
                                                <Heading mt='1rem' size="sm">
                                                    {monthlyPrice.unit_amount / 100} {monthlyPrice.currency.toUpperCase()} / mois
                                                </Heading>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            <List mt='1.5rem' pt='1.5rem' borderTopWidth='1px' spacing={3}>
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
                                    pl='1rem' 
                                    pr='1rem'
                                 
                                    maxW="sm"
                                    opacity={selectedPlan === 'monthly' ? 0.6 : 1}
                                    onClick={() => setSelectedPlan('yearly')}
                                    cursor="pointer">
                                        <AccordionButton _hover={{ boxShadow: 'none' }} onClick={() => setSelectedPlan('yearly')}>
                                            <Box flex="1" textAlign="left">
                                            <Heading color={selectedPlan === 'monthly' ? 'inherit' : '#745FF2'} fontSize="xl" mb={4}>Paiement annuel</Heading>
                                            <Heading mt='1rem' size="sm">
                                                {yearlyPrice.unit_amount / 100} {yearlyPrice.currency.toUpperCase()} / an
                                                </Heading>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            <List mt='1.5rem' pt='1.5rem' borderTopWidth='1px' spacing={3}>
                                                <ListItem>
                                                    <ListIcon as={CheckIcon} color='#745FF2' />
                                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit
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


        
                        </Flex>
                        <Button mt='2rem' mb='2rem' w={{ base: '100%', lg: 'unset' }} color='white' borderRadius='30px' backgroundColor='black' onClick={handleSubscribeClick}>
                            Souscrire
                        </Button>
                    </Flex>
                </div>
            </div>
        </div>
    );
};

export default Abo;