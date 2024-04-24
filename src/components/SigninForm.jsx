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
import { useAuth } from '../context/AuthContext'


function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const toast = useToast();
  const { baseUrl } = useInvoiceData();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/api/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        const userData = { email, name, token: data.token }; // Assurez-vous que ces données sont correctes
        login(userData); // Met à jour l'état global de l'utilisateur dans votre contexte
        navigate('/profil');
      } else {
        throw new Error(data.message || 'Impossible de se connecter');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage);
      toast({
        title: 'Erreur de connexion',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className='tabs-container' p='3rem' mt='7rem' borderWidth="1px" w="35vw" mx="auto">
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
                  h="3rem"
                  size="lg"
                  onClick={handlePasswordVisibility}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {errorMessage && <ChakraText mt='1rem' color="#FB7575">{errorMessage}</ChakraText>}
          <Button type="submit" color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
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
