import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Flex, Box } from '@chakra-ui/react';
import './App.css';
import About from '../roots/About';
import Signin from '../roots/Signin';
import Signup from '../roots/Signup';
import Header from './components/Header';
import Stepper from './components/Stepper';
import { ChakraProvider } from '@chakra-ui/react';
import { InvoiceDataProvider } from './context/InvoiceDataContext';
import theme from '../theme';
import { useAuth } from '../src/context/AuthContext';
import Sidebar from './components/Sidebar';
import Profil from '../roots/Profil';
import Factures from '../roots/Factures';
import Paiements from '../roots/Paiements';
import Paramètres from '../roots/Paramètres';
import Abo from '../roots/Abo'
import Success from '../roots/Succes';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentSuccess from '../roots/PaymentSucces';
import Footer from './components/Footer';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');


function App() {
  const { user, setUser, logout } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
    <Elements stripe={stripePromise}> 
    <ChakraProvider theme={theme}>
      <InvoiceDataProvider>
        <Router>
          <Flex direction="column" height="100vh">
            <Header />
            <Flex flex="1" overflow="hidden">
              {user && <Sidebar />}
              <Box flex="1" overflowY="auto">
                <Routes>
                <Route path="/" element={<Stepper />} /> 
                  <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/" />} />
                  <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
                  <Route path="/profil" element={<Profil />} />
                  <Route path="/factures" element={<Factures />} />
                  <Route path="/paiements" element={<Paiements />} />
                  <Route path="/parametres" element={<Paramètres />} />
                  <Route path="*" element={<Navigate to="/" />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/abo" element={<Abo />} />
                  <Route path="/success" element={<Success />} />
                </Routes>
              </Box>
            </Flex>
          </Flex>
          <Footer/>
        </Router>
      </InvoiceDataProvider>
    </ChakraProvider>
    </Elements>
    </>
  );
}

export default App;