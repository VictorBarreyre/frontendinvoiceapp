import React from 'react';
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
  return (
    <Box className='neue-up'  borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
    <Flex p='3rem' direction='column'> 
    <Heading fontSize='26px'>Factures</Heading>
  
    </Flex>
  </Box>
  )
}

export default Factures