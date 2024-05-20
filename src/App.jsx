import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notez le remplacement de Switch par Routes
import './App.css';
import About from '../roots/About';
import Login from '../roots/Login';
import Header from './components/Header';
import Stepper from './components/Stepper';
import { ChakraProvider } from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import Abo from '../roots/Abo'
import { InvoiceDataProvider } from './context/InvoiceDataContext';
import PaymentSuccess from '../roots/PaymentSucces';
import { extendTheme } from '@chakra-ui/react';
import Success from '../roots/Succes';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OwLFM00KPylCGutjKAkwhqleWEzuvici1dQUPCIvZHofEzLtGyM9Gdz5zEfvwSZKekKRgA1el5Ypnw7HLfYWOuB00ZdrKdygg');


const theme = extendTheme({
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
});


function App() {


  return (
    <>
      <Elements stripe={stripePromise}> 
      <ChakraProvider theme={theme}>
      <InvoiceDataProvider>  
        <Router>
          <Header/>
          <Routes> 
            <Route path="/" element={<Stepper />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/success" element={<Success />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/abo" element={<Abo />} />
          </Routes>
        </Router>
        </InvoiceDataProvider>
      </ChakraProvider>
      </Elements>
    </>
  );
}

export default App;
