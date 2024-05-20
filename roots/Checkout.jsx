import React from "react";
import { useLocation } from 'react-router-dom';
import { Text, Box, Flex, Heading } from '@chakra-ui/react';
import SubscribeForm from "../src/components/SubcribeForm";

const Checkout = () => {
  const location = useLocation();
  const { priceId } = location.state;

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction="column" alignItems="center" justifyContent="center" >
            <Heading mb={4}>Page de Checkout</Heading>
            <Text textAlign='center' mb={4}>Veuillez entrer vos informations de paiement pour souscrire à l'abonnement. <br/> Vous pourrez bien-sur résilier votre abonnement à tout moment</Text>
            <Box className="neue-up" width="100%" maxWidth="400px" padding="20px" borderWidth='1px' borderRadius="md">
              <SubscribeForm priceId={priceId} />
            </Box>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
