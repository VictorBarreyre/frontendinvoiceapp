import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notez le remplacement de Switch par Routes
import './App.css';
import About from '../roots/About';
import Login from '../roots/Login';
import Header from './components/Header';
import { ChakraProvider } from '@chakra-ui/react';
import InvoiceCreator from './components/InvoiceCreator';
import { InvoiceDataProvider } from './context/InvoiceDataContext';
import ConfirmationPage from '../roots/ConfirmationPage';
import { extendTheme } from '@chakra-ui/react';


const theme = extendTheme({
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
});

function App() {

  const steps = ['Étape 1', 'Étape 2', 'Étape 3'];

  return (
    <>
      <ChakraProvider theme={theme}>
      <InvoiceDataProvider>  
        <Router>
          <Header/>
          <Routes> 
            <Route path="/" element={<InvoiceCreator steps={steps} />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/confirmation" element={<ConfirmationPage/>} />
          </Routes>
        </Router>
        </InvoiceDataProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
