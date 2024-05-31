import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner
} from '@chakra-ui/react';

const Paiements = () => {
  const { user } = useAuth();
  const { checkActiveSubscription } = useInvoiceData();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box className='neue-up' borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
        <Flex p='3rem' direction='column' alignItems='center' justifyContent='center'>
          <Spinner size='xl' />
        </Flex>
      </Box>
    );
  }

  return (
    <Box borderWidth='1px' className='neue-up' borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
      <Flex p='3rem' direction='column'>
        <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Abonnement</Heading>
        
        {subscriptionStatus === 'Actif' ? (
          <Text color='green.500'>Votre abonnement est actuellement actif.</Text>
        ) : (
          <> 
          <Text color='red.500'>Vous n'avez pas d'abonnement actif.</Text>
          <Text>Vous pouvez le renouveler en choisissant la formule ci dessous</Text>
          </>
        )}
      </Flex>
    </Box>
  );
}

export default Paiements;
