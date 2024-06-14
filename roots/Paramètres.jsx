import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useInvoiceData } from '../src/context/InvoiceDataContext';
import {
  Button,
  Box,
  Flex,
  Text as ChakraText,
  Heading,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Link as Chakralink,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Paramètres = () => {
  const { user, deleteAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [accountDeleted, setAccountDeleted] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const handleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleVerifyPassword = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/verify-password`, {
        email: user.email,
        password
      });
      if (response.data.success) {
        setIsPasswordVerified(true);
        setPasswordError('');
      }
    } catch (error) {
      setPasswordError('Mot de passe incorrect.');
    }
  };

  const handleDeleteClick = async () => {
    try {
      const success = await deleteAccount(password);
      if (success) {
        setAccountDeleted(true);
        setTimeout(() => navigate('/'), 3000); // Redirige après 3 secondes
      }
    } catch (error) {
      setPasswordError('Mot de passe incorrect.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/change-password`,
        {
          currentPassword: password,
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
  
      toast({
        title: 'Mot de passe réinitialisé',
        description: response.data.message,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
  
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'Erreur lors de la réinitialisation du mot de passe');
      toast({
        title: 'Erreur',
        description: error.response?.data.message || 'Erreur lors de la réinitialisation du mot de passe',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (accountDeleted) {
    return (
      <div className='flex-stepper'>
        <div className="stepper-container">
          <div className="tabs-container">
            <Heading fontSize={{ base: '24px', lg: '26px' }}>Compte supprimé avec succès!</Heading>
            <Text>Votre compte a été supprimé avec succès.</Text>
            <Text>Vous serez redirigé vers la page d'accueil sous peu.</Text>
            <Flex mt='2rem' w='fit-content' direction='column'>
              <Chakralink as={Link} to="/">Retour à la page d'accueil</Chakralink>
            </Flex>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column'>
            <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>Paramètres</Heading>
            
            {!isPasswordVerified ? (
              <Box mt="4" w={{ base: '100%', lg: '35rem' }}>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Mot de passe actuel</FormLabel>
                  <InputGroup>
                    <ChakraInput
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
                          _focus: { boxShadow: 'none' }
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {passwordError && (
                    <Text color="red.500" mt="2">
                      {passwordError}
                    </Text>
                  )}
                </FormControl>
                <Button onClick={handleVerifyPassword} color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray">
                  Vérifier le mot de passe
                </Button>
              </Box>
            ) : (
              <Box mt="4" w={{ base: '100%', lg: '35rem' }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel htmlFor="newPassword">Nouveau mot de passe</FormLabel>
                      <InputGroup>
                        <ChakraInput
                          className='neue-down'
                          _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            background='none'
                            h="2rem"
                            size="lg"
                            onClick={handleNewPasswordVisibility}
                            icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                            sx={{
                              _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _focus: { boxShadow: 'none' }
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel htmlFor="confirmPassword">Confirmez le mot de passe</FormLabel>
                      <InputGroup>
                        <ChakraInput
                          className='neue-down'
                          _focus={{ borderColor: "#745FF2", boxShadow: "none" }}
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            background='none'
                            h="2rem"
                            size="lg"
                            onClick={handleConfirmPasswordVisibility}
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            sx={{
                              _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _focus: { boxShadow: 'none' }
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    {errorMessage && <ChakraText mt='1rem' textAlign='center' color="red">{errorMessage}</ChakraText>}
                    <Button type="submit" color='white' borderRadius='30px' backgroundColor='black' mt="4" colorScheme="gray" isLoading={isSubmitting}>
                      Réinitialiser le mot de passe
                    </Button>
                  </VStack>
                </form>
              </Box>
            )}

            <Chakralink textAlign={{ base: 'center', lg: 'unset' }} onClick={onOpen} color='red !important' mt="3rem">
              Supprimer mon compte
            </Chakralink>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Supprimer mon compte
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
                    <FormControl mt={4}>
                      <FormLabel>Mot de passe</FormLabel>
                      <InputGroup>
                        <ChakraInput
                          className='neue-down'
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
                              _focus: { color: '#745FF2', boxShadow: 'none' }
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {passwordError && (
                        <Text color="red.500" mt="2">
                          {passwordError}
                        </Text>
                      )}
                    </FormControl>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button borderRadius='30px' ref={cancelRef} onClick={onClose}>
                      Annuler
                    </Button>
                    <Button borderRadius='30px' colorScheme="red" onClick={handleDeleteClick} ml={3}>
                      Supprimer
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Paramètres;