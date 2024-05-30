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
        <Link as={RouterLink} color='black' to="/about" px="4" _hover={{ textDecoration: 'underline' }}>
          À propos
        </Link>
        <Link as={RouterLink} color='black' to="/about" px="4" mr='1rem' _hover={{ textDecoration: 'underline' }}>
          Comment ça marche ?
        </Link>
        <AccountButton />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody display='flex' flexDirection='column' alignContent='center' alignItems='center'>
            <Link as={RouterLink} to="/about" p="4" display="block" onClick={toggleDrawer}>
              À propos
            </Link>
            <Link as={RouterLink} to="/about" p="4" mb='1rem' display="block" onClick={toggleDrawer}>
              Comment ça marche ?
            </Link>
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
            <Button onClick={handleLogout} w={{ base: '100%', lg: 'fit-content' }} color='white' borderRadius='30px' pt='12px' pb='12px' pl='24px' pr='24px' backgroundColor='red' mt="4" colorScheme="gray">
              Déconnexion
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
