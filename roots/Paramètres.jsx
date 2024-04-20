import React from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Button,
  Box,
  Flex,
  Text as ChakraText
} from '@chakra-ui/react';

const Paramètres = () => {
  const { deleteAccount } = useAuth(); // Assurez-vous que deleteAccount est bien fourni par le contexte

  return (
    <Box className='neue-up'  backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
      <Flex p='3rem' direction='column' alignItems='center' justifyContent='center'>
        <Button colorScheme='red' onClick={deleteAccount}>
          Supprimer mon compte
        </Button>
        <ChakraText mt='2rem'>Attention : cette action est irréversible.</ChakraText>
      </Flex>
    </Box>
  );
};

export default Paramètres;
