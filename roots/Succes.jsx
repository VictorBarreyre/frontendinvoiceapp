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
          <Flex direction='column'> 
          <Heading fontSize={{ base: '24px', lg: '26px' }}>Facture envoyée avec Succès!</Heading>
          <Text>Votre facture a été envoyée avec succès à l'adresse email du destinataire.</Text>
          <Text>{invoiceData.client.name} recevra des rappels de paiement par email tous les 30 jours après l'émission de la facture, jusqu'à ce que vous en modifiez le statut.</Text>
          <Text>Vous pouvez consulter toutes vos factures émises sur notre page </Text> <Link to="/factures">Vos factures</Link>.
          <Flex mt='2rem' w='fit-content' direction='column'>
            <Link to="/">Retour à la page d'accueil</Link>
          </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
