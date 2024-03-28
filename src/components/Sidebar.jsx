import React from 'react';
import { Box, VStack, Link, useColorModeValue, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Sidebar = () => {
  // Utilisez useColorModeValue pour gérer les couleurs dans différents modes (clair/sombre)
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box
    className='neue-up'
      position="fixed"
      left={0}
      top='8vh'
      h="100vh"
      w={{ base: '100%', md: '250px' }} // Responsive: pleine largeur sur mobile, 250px sur tablette et au-dessus
      bg='white'
      p={5}
    >
      <VStack align="start" spacing={4}>
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          Guide Stripe
        </Text>
        {/* Liste des liens */}
        <Link as={RouterLink} to="/overview" color={textColor}>Vue d'ensemble</Link>
        <Link as={RouterLink} to="/setup" color={textColor}>Configuration</Link>
        <Link as={RouterLink} to="/charges" color={textColor}>Gestion des charges</Link>
        {/* Ajoutez plus de liens selon vos besoins */}
      </VStack>
    </Box>
  );
};

export default Sidebar;
