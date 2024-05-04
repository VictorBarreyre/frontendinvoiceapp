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
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useInvoiceData } from '../src/context/InvoiceDataContext';

const Profil = () => {
  const { user, setUser, updateUserProfile } = useAuth();
  const { baseUrl } = useInvoiceData();
  const [error, setError] = useState(''); 
  
  const [editable, setEditable] = useState({
    name: false,
    email: false,
    adresse: false,
    siret: false,
    iban: false
  });


  const toggleEditable = (field) => {
    setEditable(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e, field) => {
    if (!editable[field]) {
      setError(`Veuillez cliquer sur l'icône d'édition pour modifier le champ ${field}.`);
      return;
    }
    setUser({ ...user, [field]: e.target.value });
    setError(''); // Réinitialiser l'erreur si la modification est valide
  };

  if (!user) {
    return <div>Veuillez vous connecter pour voir le profil.</div>;
  }



  return (
    <Box className='neue-up' borderRadius='1vw' backgroundColor='white' w='90%' h={{ base: 'content', lg: '80%'}} mt='7rem' ml='3rem'>
      <Flex  direction='column' p='3rem' >
        <Heading pb='1rem' mb='2rem' borderBottom='2px solid #efefef' fontSize='26px'>Votre Profil</Heading>
        <Flex direction='column' h={{ base: 'content', lg: '20rem'}} flexWrap={{ base: 'unwrap', lg: 'wrap'}} mb='1rem'> 
        {Object.entries(user).map(([field, value]) => {
          if (field !== 'password' && field !== 'token') {
            return (
              <FormControl width='20rem' mt='4' isRequired key={field}>
                <Text mb='0.5rem' size="sm">{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <InputGroup  onClick={() => toggleEditable(field)} display='flex' alignContent='center' alignItems='center'>
                    <Input mb='2'
                      className='neue-down'
                      _focus={{ borderColor: "#745FF2", boxShadow: "0 0 0 1px #745FF2" }}
                      bg={editable[field] } // Change background color when editable
                      borderColor={editable[field] ? "#745FF2" : "inherit"} // Highlight border when editable
                      id={field}
                      type="text"
                      value={value || ''}
                      onChange={(e) => handleChange(e, field)}
                      isReadOnly={!editable[field]}
                      placeholder={`Entrez votre ${field}`}
                      color={editable[field] ? '#745FF2' : '#718096'  }
                    />

                  <InputRightElement width="4.5rem">
                    <IconButton
                      color={editable[field] ? '#745FF2' : '#718096'  }
                      aria-label={`Edit ${field}`}
                      icon={<EditIcon />}
                      background='none'
                      h="2rem"
                      size="lg"
                      sx={{
                        _hover: { background: 'none', boxShadow: 'none', transform: 'none' },
                        _active: { background: 'none', boxShadow: 'none', transform: 'none' },
                        _focus: { boxShadow: 'none' }
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
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button onClick={updateUserProfile} w={{ base: '100%', lg: '20rem' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='black' mt="4" colorScheme="gray" >
            Mettre les informations à jour
      </Button>
      </Flex>
    </Box>
  );
};

export default Profil;
