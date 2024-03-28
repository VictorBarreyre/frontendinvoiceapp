import React from 'react';
import { Flex, Box, Heading, Link, Button, useBreakpointValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Assurez-vous d'avoir react-router-dom installé pour la navigation

const Header = () => {
  // Utilisez useBreakpointValue pour des ajustements responsifs
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Flex
    className='neue-up'
      position='static'
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      color="white"
      backgroundColor="white"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" fontWeight='600' size="md">
          <Link as={RouterLink} pl='4' fontWeight='600' color='black' to="/" _hover={{ textDecoration: 'none' }}>
            db
          </Link>
        </Heading>
      </Flex>

      <Box display="flex" alignItems="center">
        <Link as={RouterLink} color='black' to="/about" px="4" _hover={{ textDecoration: 'underline' }}>
          À propos
        </Link>
        <Button
          to="/login"
          size={buttonSize}
          backgroundColor='black'
          color='white'
          borderRadius='30px'
        >
          Connexion
        </Button>
      </Box>
      
    </Flex>
  
  );
};

export default Header;
