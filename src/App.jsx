import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Flex, Box } from '@chakra-ui/react';
import './App.css';
import About from '../roots/About';
import Signin from '../roots/Signin';
import Signup from '../roots/Signup';
import Header from './components/Header';
import Home from './components/StepperNoChakra';
import CustomSection from '../roots/Home';
import { ChakraProvider } from '@chakra-ui/react';
import { InvoiceDataProvider } from './context/InvoiceDataContext';
import theme from './theme';
import ConfirmationPage from '../roots/ConfirmationPage';
import { useAuth } from '../src/context/AuthContext';
import Sidebar from './components/Sidebar';
import Profil from '../roots/Profil';
import Factures from '../roots/Factures';
import Paiements from '../roots/Paiements';
import Paramètres from '../roots/Paramètres';
import ForgotPassword from '../roots/ForgotPassword';

function App() {
  const { user, setUser, logout } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Flex direction="column" height="100vh">
          <Header />
          <Flex flex="1" overflow="hidden">
            {user && <Sidebar />}
            <Box flex="1" overflowY="auto">
              <Routes>
                <Route path="/" element={!user ? <CustomSection /> : <Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/factures" element={<Factures />} />
                <Route path="/paiements" element={<Paiements />} />
                <Route path="/parametres" element={<Paramètres />} />
                <Route path="/forgotpass" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Flex>
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
