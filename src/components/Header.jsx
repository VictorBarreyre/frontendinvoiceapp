import React, { useState } from 'react';
import { Flex, Box, Heading, Link, Button, useBreakpointValue, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import AccountButton from '../componentslittle/AccountButton';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const { user, logout } = useAuth();

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    toggleDrawer();
  };

  return (
    <Flex
      className='neue-up'
      position='fixed'
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={{ base: '0rem 1rem', md: '1rem 3rem' }}
      color="white"
      backgroundColor="white"
      height='4rem'
      width='100%'
      zIndex='1000'
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" fontWeight='600' size="md">
          <Link as={RouterLink} fontWeight='600' color='black' to="/" _hover={{ textDecoration: 'none' }}>
            dbill.io
          </Link>
        </Heading>
      </Flex>
      <IconButton
        background='none'
        aria-label="Open Menu"
        size="md"
        icon={<HamburgerIcon />}
        display={{ sm: 'flex', md: 'none' }}
        onClick={toggleDrawer}
      />
      <Flex display={{ base: 'none', md: 'flex' }} alignItems="center">
        <AccountButton />
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link as={RouterLink} fontWeight='600' color='black' to="/" _hover={{ textDecoration: 'none' }}>
              dbill.io
            </Link>
          </DrawerHeader>
          <DrawerBody display='flex' flexDirection='column' alignContent='center' alignItems='center' justifyContent='center'>
            <Flex direction='column' justifyContent='space-between' h='100%' alignItems='center'>
              <Flex direction='column' justifyContent='center' alignItems='center' h='inherit'>
                {user && (
                  <Flex direction='column' justifyContent='end' alignItems='center' h='100%' >
                    <Link as={RouterLink} to="/profil" p="4" display="block" onClick={toggleDrawer}>
                      Profil
                    </Link>
                    <Link as={RouterLink} to="/factures" p="4" display="block" onClick={toggleDrawer}>
                      Factures
                    </Link>
                    <Link as={RouterLink} to="/paiements" p="4" display="block" onClick={toggleDrawer}>
                      Abonnement
                    </Link>
                    <Link as={RouterLink} to="/parametres" p="4" display="block" onClick={toggleDrawer}>
                      Paramètres
                    </Link>
                  </Flex>
                )}
                <Flex direction='column' justifyContent='center' alignItems='center' h='inherit'>
                <Link as={RouterLink} to="/" p="4" display="block" onClick={toggleDrawer}>
                    Créer une facture
                  </Link>
                  
                  <Link as={RouterLink} to="/about" p="4" mb='1rem' display="block" onClick={toggleDrawer}>
                    Comment ça marche ?
                  </Link>
                </Flex>
              </Flex>
              {user && (
                <Button onClick={handleLogout} w={{ base: '100%', lg: 'fit-content' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='red' mb="4" colorScheme="gray">
                  Déconnexion
                </Button>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
