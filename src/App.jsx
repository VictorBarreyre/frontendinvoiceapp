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




function App() {
  return (
    <>
      <ChakraProvider>
      <InvoiceDataProvider>  
        <Router>
          <Header/>
          <Routes> 
            <Route path="/" element={<InvoiceCreator />} /> 
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
