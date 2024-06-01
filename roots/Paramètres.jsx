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
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column'>
          <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>Paramètres</Heading>
            <Button onClick={deleteAccount} w={{ base: '100%', lg: 'fit-content' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='red' mt="4" colorScheme="gray" >
              Supprimer mon compte
            </Button>
            <ChakraText mt='1rem'>Attention : cette action est irréversible.</ChakraText>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Paramètres;