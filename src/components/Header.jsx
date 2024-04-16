import React from 'react';
import { Flex, Box, Heading, Link, Button, useBreakpointValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // Assurez-vous d'avoir react-router-dom installé pour la navigation

const Header = () => {
  // Utilisez useBreakpointValue pour des ajustements responsifs
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Flex
      className='neue-up'
      position='fixed'
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      color="white"
      backgroundColor="white"
      width='100%'
      zIndex='1000'
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
        <Link as={RouterLink} color='black' to="/about" px="4" _hover={{ textDecoration: 'underline' }}>
          Comment ça marche ?
        </Link>
        <Button
      as={RouterLink}
      to="/login"
      size={buttonSize}
      backgroundColor='black'
      color='white'
      borderRadius='30px'
      sx={{
        '&:hover': {
          boxShadow: 'rgba(174, 174, 192, 0.4) -1.5px -1.5px 3px 0px, rgba(255, 255, 255) 1.5px 1.5px 3px 0px',
          color: '#745FF2',
          backgroundColor: 'white !important'
        }
      }}
    >
      Créez votre compte 
    </Button>
      </Box>
      
    </Flex>
  
  );
};

export default Header;
