import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Button,
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  FormLabel,
  Input as ChakraInput,
  Link as Chakralink,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';

const Profil = () => {
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [accountDeleted, setAccountDeleted] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    _id: user ? user._id : '',
    email: user ? user.email : '',
    name: user ? user.name : '',
    adresse: user ? user.adresse : '',
    siret: user ? user.siret : '',
    iban: user ? user.iban : ''
  });

  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData({
        _id: user ? user._id : '',
        email: user.email || '',
        name: user.name || '',
        adresse: user.adresse || '',
        siret: user.siret || '',
        iban: user.iban || ''
      });
    }
  }, [user]);

  const handleChange = (e, field) => {
    setUserData({ ...userData, [field]: e.target.value });
    setError('');
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleUpdateClick = () => {
    updateUserProfile(userData);
    console.log(userData);
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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              <Link to="/">Retour à la page d'accueil</Link>
            </Flex>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Veuillez vous connecter pour voir le profil.</div>;
  }

  return (
    <div className='flex-stepper'>
      <div className="stepper-container">
        <div className="tabs-container">
          <Flex direction='column'>
            <Heading pb='1rem' mb={{ base: '0rem', lg: '2rem' }} borderBottom={{ base: 'unset', lg: '2px solid #efefef' }} fontSize={{ base: '22px', lg: '26px' }}>Votre Profil</Heading>
            <Flex direction='column' h={{ base: 'content', lg: '20rem' }} flexWrap={{ base: 'unwrap', lg: 'wrap' }} mb='1rem'>
              {Object.entries(userData).map(([field, value]) => {
                if (field !== 'password' && field !== 'token' && field !== '_id') {
                  return (
                    <FormControl width={{ base: 'unset', lg: '20rem' }} mt='4' isRequired key={field}>
                      <Text mb='0.5rem' size="sm">{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                      <InputGroup display='flex' alignContent='center' alignItems='center' >
                        <Input
                          mb='2'
                          className='neue-down'
                          color='grey'
                          _focus={{ color: '#745FF2', borderColor: "#745FF2", boxShadow: "0 0 0 1px #745FF2" }}
                          id={field}
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleChange(e, field)}
                          onFocus={() => handleFocus(field)}
                          onBlur={handleBlur}
                          placeholder={`Entrez votre ${field}`}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            color={focusedField === field ? '#745FF2' : '#718096'}
                            aria-label={`Edit ${field}`}
                            icon={<EditIcon />}
                            background='none'
                            h="2rem"
                            size="lg"
                            sx={{
                              _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                              _focus: { color: '#745FF2', boxShadow: 'none' }
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  );
                }
                return null;
              })}
            </Flex>
            {error && (
              <Alert status="error" mb="4">
                {error}
              </Alert>
            )}
            <Button onClick={handleUpdateClick} w={{ base: '100%', lg: '20rem' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='black' mt="4" colorScheme="gray" >
              Mettre les informations à jour
            </Button>

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
                    <Button ref={cancelRef} onClick={onClose}>
                      Annuler
                    </Button>
                    <Button colorScheme="red" onClick={handleDeleteClick} ml={3}>
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

export default Profil;
