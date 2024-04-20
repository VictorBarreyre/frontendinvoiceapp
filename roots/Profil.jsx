import React from 'react';
import { useAuth  } from '../src/context/AuthContext';
import {
  Button,
  Link as Chakralink,
  Box,
  Heading,
  Text,
  Flex
}   from '@chakra-ui/react'

const Profil = () => {
  const { user } = useAuth(); // Accéder aux données de l'utilisateur via le contexte

  if (!user) {
    return <div>Veuillez vous connecter pour voir le profil.</div>;
  }
console.log(user)

  return (
    <Box className='neue-up'  borderRadius='1vw' backgroundColor='white' w='90%' h='80%' mt='7rem' ml='3rem'>
      <Flex p='3rem' direction='column'> 
      <Heading fontSize='26px'>Profil de l'utilisateur</Heading>
      <Text>Nom : {user.name}</Text>
      <Text>Email :{user.email}</Text>
      {user.adresse && <p><strong>Adresse :</strong> {user.adresse}</p>}
      {user.siret && <p><strong>SIRET :</strong> {user.siret}</p>}
      {user.iban && <p><strong>IBAN :</strong> {user.iban}</p>}
      {/* Vous pouvez ajouter d'autres champs ici de manière similaire */}
      </Flex>
    </Box>
  );
};

export default Profil;
