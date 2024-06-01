import React from 'react';
import { Box, Flex, Link, Text, useBreakpointValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const linkSize = useBreakpointValue({ base: 'sm', md: 'md' });

    return (
        <Box
            className='neue-up'
            borderWidth='1px'
            as="footer"
            width="100%"
            py={{ base: '2rem', md: '3rem' }}
            px={{ base: '1rem', md: '3rem' }}
            backgroundColor="white"
            color="black"
        >
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align="center"
                justify="space-between"
                wrap="wrap"
                margin="0 auto"
            >
                <Flex align="center" mb={{ base: '2rem', md: '0' }}>
                    <Text fontSize="lg" fontWeight="bold">
                        <Link color='black' as={RouterLink} to="/" _hover={{ textDecoration: 'none', color: 'black' }}>
                            dbill.io
                        </Link>
                    </Text>
                </Flex>
                <Flex direction={{ base: 'column', md: 'row' }} align="center">
                    <Link as={RouterLink} to="/mentions-legales" mx="4" mb={{ base: '1rem', md: '0' }} color='black' fontSize={linkSize}>
                        Mentions légales
                    </Link>
                    <Link as={RouterLink} to="/politique-de-confidentialite" mx="4" mb={{ base: '1rem', md: '0' }} color='black' fontSize={linkSize}>
                        Politique de confidentialité
                    </Link>
                    <Link as={RouterLink} to="/conditions-generales" mx="4" mb={{ base: '1rem', md: '0' }} color='black' fontSize={linkSize}>
                        Conditions Générales d'Utilisation
                    </Link>
                    <Link as={RouterLink} to="/contact" mx="4" color='black' fontSize={linkSize}>
                        Contact
                    </Link>
                    <Text textAlign="center"  color='black' fontSize="sm">
                &copy; {new Date().getFullYear()} dbill.io. Tous droits réservés.
            </Text>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Footer;
