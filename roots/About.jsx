import React from 'react';
import {
  Box,
  Text,
  Heading,
  Flex,
} from '@chakra-ui/react';
import {
  EditIcon,
  EmailIcon,
  LinkIcon,
  LockIcon,
} from '@chakra-ui/icons';

// Composant pour les cartes d'étape
const Feature = ({ title, text, icon }) => {
  return (
    <Flex className='neue-up'
      backgroundColor='white'
      flexDirection='column'
      borderRadius='1vw'
      alignItems={'center'}
      textAlign={'center'}
      h='fit-content'
      w='40vh'
      m='2vh'
      p='4vh'>
      <Flex
        borderBottom='1px solid grey'
        w='100%'
        align={'center'}
        justify={'center'}
        flexDirection='column'
        mb={1}
        pb='3vh'>
        <Flex w='100%' justifyContent='center' alignContent='center' alignItems='center' gap='10px' mb='2'>
          <Heading size='md' mb='0' fontWeight={600}>{title}</Heading> 
          {icon}
        </Flex>
        <Text color="#4A5568">{text}</Text>
      </Flex>
    </Flex>
  );
};

// Page À propos
const AboutPage = () => {
  return (
    <Flex direction='column' alignItems='center' mt="5rem" pl={5} pr={5}>
      <Heading textAlign='center' mb="4">À propos de dbill</Heading>
      <Flex direction='column' spacing={10} px={12}>
        <Feature
          icon={<EditIcon color='black' w={4} h={4} />}
          title="Créer une facture"
          text="Commencez par créer une facture ou un devis directement sur notre site."
        />
        <Feature
          icon={<EmailIcon color='black' w={4} h={4} />}
          title="Envoyer au destinataire"
          text="L'envoi se fait facilement par email, permettant au destinataire de recevoir tout ce dont il a besoin sans délai."
        />
        <Feature
          icon={<LinkIcon color='black' w={4} h={4} />}
          title="Accéder au contrat"
          text="Le destinataire accède à la plateforme via un lien pour signer le contrat."
        />
        <Feature
          icon={<LockIcon color='black' w={4} h={4} />}
          title="Paiement automatique"
          text="Après signature, le paiement s'effectue automatiquement."
        />
      </Flex>
    </Flex>
  );
};

export default AboutPage;
