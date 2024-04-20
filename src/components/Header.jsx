import React, { useState } from 'react';
import { Flex, Box, Heading, Link, Button, useBreakpointValue, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import AccountButton from '../componentslittle/AccountButton';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <Flex
      position='fixed'
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem 3rem"
      color="white"
      backgroundColor="white"
      height='4rem'
      width='100%'
      zIndex='1000'
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" fontWeight='600' size="md">
          <Link as={RouterLink} pl='4' fontWeight='600' color='black' to="/" _hover={{ textDecoration: 'none' }}>
            dbill.io
          </Link>
        </Heading>
      </Flex>

      <IconButton
        aria-label="Open Menu"
        size="md"
        mr={2}
        icon={<HamburgerIcon />}
        display={{ sm: 'flex', md: 'none' }}
        onClick={toggleDrawer}
      />

      <Box display={{ base: 'none', md: 'flex' }} mr='2.5rem' alignItems="center">
        <Link as={RouterLink} color='black' to="/about" px="4" _hover={{ textDecoration: 'underline' }}>
          À propos
        </Link>
        <Link as={RouterLink} color='black' to="/about" px="4" mr='1rem' _hover={{ textDecoration: 'underline' }}>
          Comment ça marche ?
        </Link>
        <AccountButton/>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={toggleDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Link as={RouterLink} to="/about" p="4" display="block" onClick={toggleDrawer}>
              À propos
            </Link>
            <Link as={RouterLink} to="/about" p="4" display="block" onClick={toggleDrawer}>
              Comment ça marche ?
            </Link>
            <AccountButton onClick={toggleDrawer} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
