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
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { baseUrl } = useInvoiceData();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Prevent multiple submissions

    try {
      const response = await fetch(`${baseUrl}/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Utilisateur ou mot de passe incorrect');
      }

      const data = await response.json();
      const userData = {
        _id: data._id,
        email,
        token: data.token,
        name: data.name,
        adresse: data.adresse,
        siret: data.siret,
        iban: data.iban
      };

      login(userData); // Update global user state in your context
      navigate('/profil');
    } catch (error) {
      setErrorMessage(error.message || 'Utilisateur ou mot de passe incorrect');
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Utilisateur ou mot de passe incorrect',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // Re-enable the form
    }
  };

  return (

    <Box className='tabs-container'p={{ base: '2rem', md: '3rem' }} mt={{ base: '4rem', md:'7rem', lg: '7rem' }} borderWidth="1px"  w={{ base: 'unset', md:'35rem', lg: '35rem' }} mx="auto" h={{ base: '100vh', md: 'inherit' }}>
      <Heading textAlign='center' mb='2rem' fontSize='26px'>Connectez-vous à votre compte</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input _focus={{ borderColor: "#745FF2", boxShadow: "none" }} id="email" className='neue-down' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Mot de passe</FormLabel>
            <InputGroup>
              <Input
                className='neue-down'
                _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  background='none'
                  h="2rem"
                  size="lg"
                  onClick={handlePasswordVisibility}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  sx={{
                    _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                    _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                    _focus: { boxShadow: 'none' } // Annule l'effet de focus aussi
                  }}
                />
              </InputRightElement>
            </InputGroup>
            <ChakraText mt={4} textAlign='center'>
              <ChakraLink as={RouterLink} to="/forgotpass" style={{ color: "#745FF2" }}>Mot de passe oublié ?</ChakraLink>
            </ChakraText>
          </FormControl>
          {errorMessage && <ChakraText mt='1rem' textAlign='center' color="red">{errorMessage}</ChakraText>}
          <Button type="submit" color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" isLoading={isSubmitting}>
            Se connecter
          </Button>
          <ChakraText mt={4}>
            Pas encore inscrit ? <ChakraLink as={RouterLink} to="/signup" style={{ color: "#745FF2" }}>Créez un compte</ChakraLink>
          </ChakraText>
        </VStack>
      </form>
    </Box>

  );
}

export default SignInForm;
