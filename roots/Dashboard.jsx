import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('tab1');
  const { user, logout } = useAuth();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul className="tab-list-dashboard">
          <li className={`tab ${activeTab === 'tab1' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab1')}>Profil</li>
          <li className={`tab ${activeTab === 'tab2' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab2')}>Factures</li>
          <li className={`tab ${activeTab === 'tab2' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab3')}>Paiements</li>
          <li className={`tab ${activeTab === 'tab3' ? 'active-dashboard' : ''}`} onClick={() => handleTabClick('tab4')}>Paramètres</li>
        </ul>
      </div>
      <div className="content-dashboard">
        <div id="tab1" className={`tab-content ${activeTab === 'tab1' ? 'active-dashboard' : ''}`}>
          <h1>Bienvenue sur votre Dashboard, <br/> {user.name}!</h1>
          <p>Vous êtes maintenant connecté.</p>
          <button>Voir Mes Factures</button>
          <button onClick={logout}>Déconnexion</button>
        </div>
        <div id="tab2" className={`tab-content ${activeTab === 'tab2' ? 'active-dashboard' : ''}`}>
          <p>Voici vos factures...</p>
        </div>
        <div id="tab3" className={`tab-content ${activeTab === 'tab3' ? 'active-dashboard' : ''}`}>
          <p>Vos paiements</p>
        </div>
        <div id="tab3" className={`tab-content ${activeTab === 'tab4' ? 'active-dashboard' : ''}`}>
          <p>Paramètres de compte...</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
