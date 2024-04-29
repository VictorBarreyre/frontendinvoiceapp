import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  VStack,
  useToast,
  Box,
  Heading,
  Text as ChakraText,
  Link as ChakraLink,
  IconButton
} from '@chakra-ui/react';

import { useAuth } from '../src/context/AuthContext'

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const { requestPasswordReset } = useAuth(); // Ajout de cette ligne
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      toast({
        title: "Email envoyé.",
        description: "Un lien pour réinitialiser votre mot de passe a été envoyé à votre adresse email.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erreur.",
        description: "Impossible d'envoyer l'email de réinitialisation.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className='tabs-container' p='3rem' mt='7rem' borderWidth="1px" w="35rem" mx="auto">
      <Heading textAlign='center' mb='2rem' fontSize='26px'>Mot de passe oublié</Heading>
      <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
      <FormControl isRequired>
            <FormLabel htmlFor="email">Votre email associé au compte</FormLabel>
            <Input _focus={{ borderColor: "#745FF2", boxShadow: "none" }} id="email" className='neue-down' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <ChakraText textAlign='center' mt={4}>
           Nous vous enverrons un lien pour réinitialiser votre mot de passe
          </ChakraText>
        <Button type="submit" color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
          Envoyer
        </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default ForgotPassword;
