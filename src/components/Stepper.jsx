import React, { useState } from 'react';
import { Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from '@chakra-ui/react'
import InvoiceCreator from './InvoiceCreator';
import PaymentScheduleForm from './PaymentScheduleForm';
import InvoiceSummary from './InvoiceSummary';

const Stepper = () => {


  return (

    
    <Flex mt='2rem' direction='column' alignContent='center' alignItems='center'> 
    <Tabs className='neue-up' width='65vw' pt='2rem' pl='3rem' pr='3rem' pb='2rem' background='white' borderRadius='1vw'>
      <TabList className='neutre'>
        <Tab
          _selected={{
            border: 'none',
            borderBottom: '2px solid #745FF2',
            borderRadius: '0px',
            color: '#745FF2'
          }}
          _hover={{
            borderRadius: '0px',
            backgroundColor: 'rgb(247, 249, 252)!important',
            boxShadow: 'none',
            color: '#745FF2'
          }}
          _focus={{
            boxShadow: 'none',
            outline: 'none'
          }}
          sx={{
            fontFamily: "'SF Pro Display', sans-serif",
            fontWeight: '400',
            // Appliquer d'autres styles neutres ici si nécessaire
          }}
        > Facture</Tab>
        <Tab
          _selected={{
            border: 'none',
            borderBottom: '2px solid #745FF2',
            borderRadius: '0px',
            color: '#745FF2'
          }}
          _hover={{
            borderRadius: '0px',
            backgroundColor: 'rgb(247, 249, 252)!important',
            boxShadow: 'none',
            color: '#745FF2'
          }}
          _focus={{
            boxShadow: 'none',
            outline: 'none'
          }}
          sx={{
            fontFamily: "'SF Pro Display', sans-serif",
            fontWeight: '400',
            // Appliquer d'autres styles neutres ici si nécessaire
          }}
        >Échéances & Paiements</Tab>
        <Tab
          _selected={{
            border: 'none',
            borderBottom: '2px solid #745FF2',
            borderRadius: '0px',
            color: '#745FF2'
          }}
          _hover={{
            borderRadius: '0px',
            backgroundColor: 'rgb(247, 249, 252)!important',
            boxShadow: 'none',
            color: '#745FF2'
          }}
          _focus={{
            boxShadow: 'none',
            outline: 'none !important'
          }}
          sx={{
            fontFamily: "'SF Pro Display', sans-serif",
            fontWeight: '400',
            // Appliquer d'autres styles neutres ici si nécessaire
          }}
        >Envoie</Tab>
      </TabList>

      <TabPanels>
        <TabPanel pt="2rem">
          <Heading mb='1rem' size="md">Créez votre facture</Heading>
          <InvoiceCreator/>
        </TabPanel>
        <TabPanel pt="2rem">
          <Heading mb='1rem' size="md">Créez votre facture</Heading>
          <PaymentScheduleForm/>
        </TabPanel>
        <TabPanel pt="2rem">
          <Heading mb='1rem' size="md">Créez votre facture</Heading>
          <InvoiceSummary />
        </TabPanel>
      </TabPanels>
    </Tabs>
    </Flex>
  );
};

export default Stepper;

