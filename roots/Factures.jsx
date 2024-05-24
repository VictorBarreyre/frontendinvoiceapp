import React, { useEffect, useState } from 'react';
import { useAuth  } from '../src/context/AuthContext';
import {
  Button,
  Link as Chakralink,
  Box,
  Heading,
  Text,
  Flex
}   from '@chakra-ui/react'

const Factures = () => {
  const { fetchUserInvoices } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      const { invoices, message } = await fetchUserInvoices();
      setInvoices(invoices);
      setMessage(message);
    };

    loadInvoices();
  }, [fetchUserInvoices]);


  return (
    <Box className='neue-up'  borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
    <Flex p='3rem' direction='column'> 
    <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Factures</Heading>
    {message && <Text>{message}</Text>}
        {invoices.map(invoice => (
          <Text key={invoice._id}>{invoice.description} - Montant: {invoice.amount}</Text>
        ))}
    </Flex>
  </Box>
  )
}

export default Factures