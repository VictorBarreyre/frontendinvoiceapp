import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button, Flex, Box } from '@chakra-ui/react';
import './App.css';
import About from '../roots/About';
import Signin from '../roots/Signin';
import Signup from '../roots/Signup';
import Header from './components/Header';
import StepperNoChakra from './components/StepperNoChakra';
import { ChakraProvider } from '@chakra-ui/react';
import { InvoiceDataProvider } from './context/InvoiceDataContext';
import theme from './theme';
import Dashboard from '../roots/Dashboard';
import ConfirmationPage from '../roots/ConfirmationPage';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

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
      <InvoiceDataProvider>
        <Router>
          <Flex direction="column" height="100vh"> {/* Assurez-vous que l'app prend toute la hauteur */}
            <Header />
            <Flex flex="1" overflow="hidden"> {/* Flex container pour Sidebar et content */}
              {user && <Sidebar />}
              <Box flex="1" overflowY="auto"> {/* Container pour les routes */}
                <Routes>
                  <Route path="/" element={<StepperNoChakra />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Box>
            </Flex>
          </Flex>
        </Router>
      </InvoiceDataProvider>
    </ChakraProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Si l'utilisateur n'est pas connecté, redirigez vers la page de connexion
    return <Navigate to="/signin" />;
  }

  return children;
}

export default App;
