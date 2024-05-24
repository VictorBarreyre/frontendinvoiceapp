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

const Paiements = () => {
  return (
    <Box className='neue-up'  borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
    <Flex p='3rem' direction='column'> 
    <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Paiements</Heading>
  
    </Flex>
  </Box>
  )
}

export default Paiements