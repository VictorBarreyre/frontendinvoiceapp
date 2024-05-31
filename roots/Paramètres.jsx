import React from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Button,
  Box,
  Flex,
  Text as ChakraText,
  Heading
} from '@chakra-ui/react';

const Paramètres = () => {

  const { deleteAccount } = useAuth();

  return (
    <Box className='neue-up' borderWidth='1px' borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
    <Flex p='3rem' direction='column'> 
      <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Paramètres</Heading>
      <Button onClick={deleteAccount}  w={{ base: '100%', lg: 'fit-content' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='red' mt="4" colorScheme="gray" >
        Supprimer mon compte
        </Button>
        <ChakraText mt='1rem'>Attention : cette action est irréversible.</ChakraText>
      </Flex>
    </Box>
  );
};

export default Paramètres;