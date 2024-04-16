import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Box,
  Heading
} from '@chakra-ui/react';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ici, ajoutez la logique pour envoyer les données à l'API
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, firstName, lastName })
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Compte créé.',
          description: "Nous avons créé votre compte avec succès!",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        // Réinitialiser les champs ou rediriger l'utilisateur
      } else {
        throw new Error(data.message || 'Impossible de créer le compte');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className='tabs-container' p='3rem' mt='7rem' borderWidth="1px" w="65vw" mx="auto">
      <Heading textAlign='center' mb='2rem' fontSize='26px'>Créez votre compte</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
        <FormControl isRequired>
            <FormLabel htmlFor="lastName">Nom & Prénom</FormLabel>
            <Input id="lastName" className='neue-down' type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" className='neue-down' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Mot de passe</FormLabel>
            <Input id="password" className='neue-down' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
                   Créer mon compte
                </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default SignupForm;
