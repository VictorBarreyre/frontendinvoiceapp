import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Box,
  Heading,
  Link as ChakraLink,
  Text as ChakraText,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useInvoiceData } from '../context/InvoiceDataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'



function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const { baseUrl } = useInvoiceData();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleConfirmPassworddVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return; // Stop the submission if passwords do not match
    } else {
      setErrorMessage(''); // Clear error message
    }

    try {
      const response = await fetch(`${baseUrl}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        login({ email, name, id: data._id }); // Assurez-vous que la méthode login est récupérée avec useAuth()
        console.log('Inscription réussie et utilisateur connecté');
      } else {
        throw new Error(data.message || 'Impossible de créer le compte');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage)
    }
  };

  return (
    <Box className='tabs-container' p='3rem' mt='7rem' borderWidth="1px" w="35vw" mx="auto">
      <Heading textAlign='center' mb='2rem' fontSize='26px'>Créez votre compte</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="lastName">Nom & Prénom</FormLabel>
            <Input _focus={{ borderColor: "#745FF2", boxShadow: "none" }} id="lastName" className='neue-down' type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
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
                type={showPassword ? "text" : "password"}
                id="password"
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
          <FormControl isRequired>
            <FormLabel htmlFor="confirmPassword">Confirmez le mot de passe</FormLabel>
            <InputGroup>
            <Input _focus={{ borderColor: "#745FF2", boxShadow: "none" }} className='neue-down' id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <InputRightElement width="4.5rem">
              <IconButton
                  background='none'
                  h="3rem"
                  size="lg"
                  onClick={handleConfirmPassworddVisibility}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                />
              </InputRightElement>
              </InputGroup>
            {errorMessage && <ChakraText mt='1rem' color="#FB7575">{errorMessage}</ChakraText>}
          </FormControl>
          <Button onClick={handleSubmit} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
            Créer mon compte
          </Button>
          <ChakraText mt={4}>
          Déjà inscrit ? <ChakraLink as={RouterLink} to="/signin" style={{ color: "#745FF2" }}>Connectez-vous</ChakraLink>
          </ChakraText>
        </VStack>
      </form>
    </Box>
  );
}

export default SignupForm;