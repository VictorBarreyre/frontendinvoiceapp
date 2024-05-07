import React, { useEffect, useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Button,
  Alert,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

const Profil = () => {
  const { user, updateUserProfile } = useAuth();
  const [error, setError] = useState('');

  const [userData, setUserData] = useState({
    _id: user ? user._id : '',
    email: user ? user.email : '',
    name: user ? user.name : '',
    adresse: user ? user.adresse : '',
    siret: user ? user.siret : '',
    iban: user ? user.iban : ''
  });
  
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
  const handleUpdateClick = () => {
    updateUserProfile(userData);
    console.log(userData)
  };

  if (!user) {
    return <div>Veuillez vous connecter pour voir le profil.</div>;
  }

  return (
    <Box className='neue-up' borderRadius='1vw' backgroundColor='white' w='90%' h={{ base: 'content', lg: '80%' }} mt='7rem' ml='3rem'>
      <Flex direction='column' p='3rem' >
        <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Votre Profil</Heading>
        <Flex direction='column' h={{ base: 'content', lg: '20rem' }} flexWrap={{ base: 'unwrap', lg: 'wrap' }} mb='1rem'>
          {Object.entries(userData).map(([field, value]) => {
            if (field !== 'password' && field !== 'token' && field !== '_id') {
              return (
                <FormControl width='20rem' mt='4' isRequired key={field}>
                <Text mb='0.5rem' size="sm">{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <InputGroup  display='flex' alignContent='center' alignItems='center' >
                  <Input
                    mb='2'
                    className='neue-down'
                    color='grey'
                    _focus={{color:'#745FF2', borderColor: "#745FF2", boxShadow: "0 0 0 1px #745FF2" }}
                    id={field}
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange(e, field)} 
                    placeholder={`Entrez votre ${field}`}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      color={'#718096'}
                      aria-label={`Edit ${field}`}
                      icon={<EditIcon />}
                      background='none'
                      h="2rem"
                      size="lg"
                      sx={{
                        _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                        _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                        _focus: {color:'#745FF2', boxShadow: 'none' }
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
      </Flex>
    </Box>
  );
};

export default Profil;
