import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  VStack,
  useToast,
  Box,
  Heading,
  Text as ChakraText,
  Link as ChakraLink,
  IconButton
} from '@chakra-ui/react';

import { useAuth } from '../src/context/AuthContext'


function ResetPassword() {
    const [password, setPassword] = useState('');
    const { resetPassword } = useAuth(); // Cette fonction doit être définie dans votre AuthContext
    const [token, setToken] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      if (tokenParam) {
        setToken(tokenParam);
      }
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await resetPassword(token, password);
        navigate('/login'); // Redirigez l'utilisateur vers la page de connexion après la réinitialisation
      } catch (error) {
        console.error('Failed to reset password:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Réinitialiser le mot de passe</Button>
      </form>
    );
  }
  
  export default ResetPassword;
  