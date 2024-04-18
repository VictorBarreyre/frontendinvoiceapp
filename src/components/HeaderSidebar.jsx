import React, { useState } from 'react';
import { Flex, Box, Heading, Link, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import AccountButton from '../componentslittle/AccountButton';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Utilisation de useAuth pour accéder à l'utilisateur connecté
  const [activeTab, setActiveTab] = useState('tab1');

  const toggleDrawer = () => setIsOpen(!isOpen);
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <Flex
      position='fixed'
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      color="white"
      backgroundColor="white"
      height='4rem'
      width='100%'
      zIndex='1000'
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" fontWeight='600' size="md">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
            db
          </Link>
        </Heading>
      </Flex>

      <IconButton
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        onClick={toggleDrawer}
        display={{ sm: 'flex', md: 'none' }}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Link as={RouterLink} to="/about" onClick={toggleDrawer}>À propos</Link>
            <Link as={RouterLink} to="/about" onClick={toggleDrawer}>Comment ça marche ?</Link>
            <AccountButton onClick={toggleDrawer} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
