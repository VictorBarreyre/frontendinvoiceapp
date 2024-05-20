import React, { useState, useEffect } from 'react';
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
    Link,
} from '@chakra-ui/react';
import { CheckCircleIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import SubscribeForm from '../src/components/SubcribeForm';

const Abo = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { baseUrl, createCheckoutSession } = useInvoiceData();
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const { invoiceData } = useInvoiceData();

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

    const handleSendInvoice = () => {
        createCheckoutSession(selectedPriceId, (sessionId) => {
            console.log(`Checkout session created: ${sessionId}`);
        }, () => {
            console.error('Error creating checkout session');
        });
    };

    return (
        <div className='flex-stepper'>
            <div className="stepper-container">
                <div className="tabs-container">
                    <Flex direction="column">
                        <Heading fontSize={{ base: '24px', lg: '26px' }} mb='1rem'>Choisissez votre formule d'abonnements</Heading>
                        <Text w='100%' mb='2rem'>
                            Une fois votre abonnement créé, nous vous enverrons un e-mail contenant un récapitulatif de votre formule <br />
                            et un mot de passe provisoire que nous vous invitons à modifier dans votre espace profil.
                        </Text>
                        <Flex justifyContent='space-between' alignItems='start'>
                            <Flex direction='column' w='50%' gap='15px'>
                                <Heading size="sm">Vos informations</Heading>
                                <SubscribeForm priceId={selectedPriceId} />
                            </Flex>
                            <Flex direction='column' w='45%' justify="center" gap='15px'>
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
                                <Text> En continuant, vous acceptez <Link color='#745FF2'> nos termes et conditions.</Link></Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </div>
            </div>
        </div>
    );
};

export default Abo;
