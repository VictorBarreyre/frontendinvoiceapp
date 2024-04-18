import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const { user, logout } = useAuth();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  if (!user) {
    return null; // Ne rien afficher si l'utilisateur n'est pas connecté
  }

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ul className="tab-list-dashboard" style={{ flex: 1 }}>
        <li className={`tab ${activeTab === 'tab1' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab1')}>Profil</li>
        <li className={`tab ${activeTab === 'tab2' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab2')}>Factures</li>
        <li className={`tab ${activeTab === 'tab3' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab3')}>Paramètres</li>
      </ul>
      <button onClick={logout} style={{ margin: '20px', alignSelf: 'center' }}>Déconnexion</button>
    </div>
  );
};

export default Sidebar;
