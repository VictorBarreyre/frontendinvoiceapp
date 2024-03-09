import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notez le remplacement de Switch par Routes
import './App.css';
import Home from '../roots/Home';
import About from '../roots/About';
import Login from '../roots/Login';
import Header from './components/Header';
import { ChakraProvider } from '@chakra-ui/react';
import MyForm from './components/MyForm';



function App() {
  return (
    <>
      <ChakraProvider>
        <Router>
          <Header/>
          <Routes> 
            <Route path="/" element={<Home />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
