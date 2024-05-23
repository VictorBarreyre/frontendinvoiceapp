import React, { useState } from 'react';
import { Heading, Text, Button, Flex } from '@chakra-ui/react';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import { Link, useNavigate } from 'react-router-dom';


const SuccessPage = () => {
  const { invoiceData, baseUrl } = useInvoiceData();


  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Heading fontSize={{ base: '24px', lg: '26px' }}>Facture envoyée avec Succès!</Heading>
          <Text>Votre facture a été envoyée avec succès à l'adresse email du destinataire.</Text>
          <Text>Vous pouvez aussi définir des relances de paiement par mail à {invoiceData.client.name}</Text>
          <Text>Les relances sont définies en fonction des dates de vos échéances</Text>
           <Flex  mt='2rem' w='fit-content' direction='column'>        
          <Link to="/">Retour à la page d'accueil</Link>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
