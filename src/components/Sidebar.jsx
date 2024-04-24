import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  Link as Chakralink,
}
  from '@chakra-ui/react'



//definir une logique active en fonction du root car bug sur la couleur violet 
const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const { user, logout } = useAuth();
  const [redirectOnLogout, setRedirectOnLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  if (!user) {
    return null; // Ne rien afficher si l'utilisateur n'est pas connecté
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active-dashboard' : '';
  };

  if (redirectOnLogout) {
    return <Navigate to="/" />;
  }

  return (
    <div className="sidebar neue-up" style={{ display: 'flex', flexDirection: 'column', height: '80%' }}>
      <ul className="tab-list-dashboard">
        <li className={`tab ${getActiveClass('/profil')}`}>
          <Link to="/profil" onClick={() => handleTabClick('tab1')}>Profil</Link>
        </li>
        <li className={`tab ${getActiveClass('/factures')}`}>
          <Link to="/factures" onClick={() => handleTabClick('tab2')}>Factures</Link>
        </li>
        <li className={`tab ${getActiveClass('/paiements')}`}>
          <Link to="/paiements" onClick={() => handleTabClick('tab3')}>Paiements</Link>
        </li>
        <li className={`tab ${getActiveClass('/parametres')}`}>
          <Link to="/parametres" onClick={() => handleTabClick('tab4')}>Paramètres</Link>
        </li>
      </ul>
      <Chakralink onClick={handleLogout} type="submit" color='red' borderRadius='30px' mb='1.5rem' mt="4" w='100%' colorScheme="gray">
        Déconnexion
      </Chakralink>
    </div>
  );
};

export default Sidebar;
