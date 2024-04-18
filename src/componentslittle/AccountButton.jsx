import React from 'react';
import { Button, Icon, Link } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function AccountButton() {
    const { user } = useAuth();
    const buttonSize = "sm"; // Taille du bouton, ajustez selon vos besoins

    return user ? (

        <Link 
        as={RouterLink}
        to="/dashboard"
        h='1.5rem'> <Icon h='1.5rem' w='1.5rem' color='black' as={FaUserCircle} /> </Link>

    ) : (
        <Button
            as={RouterLink}
            to="/signup"
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
    );
}

export default AccountButton;
