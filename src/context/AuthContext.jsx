import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoiceData } from './InvoiceDataContext';

const AuthContext = createContext(null); // Utiliser null pour une valeur initiale claire

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      // Complétez l'utilisateur stocké avec les valeurs par défaut si certaines valeurs sont manquantes
      const completeUser = {
        _id : storedUser._id || '',
        email: storedUser.email || '',
        name: storedUser.name || '',
        adresse: storedUser.adresse || '',
        siret: storedUser.siret || '',
        iban: storedUser.iban || '',
        ...storedUser // Cela garantit que les valeurs non spécifiées seront prises depuis le localStorage
      };
      setUser(completeUser);
      console.log(completeUser)
    }
  }, []);  

const login = (userData) => {
    // Assurez-vous que toutes les propriétés nécessaires sont incluses lors du login
    const completeUser = {
      _id:userData._id,
      email: userData.email || '',
      name: userData.name || '',
      adresse: userData.adresse || '',
      siret: userData.siret || '',
      iban: userData.iban || '',
      ...userData
    };
    setUser(completeUser);
    console.log(userData)
    localStorage.setItem('user', JSON.stringify(completeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  
  function cleanObject(obj, cache = new WeakSet()) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if (cache.has(obj)) {
      return {};
    }
    cache.add(obj);
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      newObj[key] = typeof value === 'object' ? cleanObject(value, cache) : value;
    }
    return newObj;
  }
  
  const fetchUserInvoices = async () => {
    if (!user) {
      console.error('Aucun utilisateur connecté pour récupérer les factures.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user._id}/invoices`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,  // Assurez-vous que l'authentification est correctement gérée
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch invoices');
      }
  
      const invoices = await response.json();
      return invoices; // Vous pouvez décider de stocker les factures dans le state global ou de les retourner simplement ici
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  };
  

  const updateUserProfile = async (userData) => {
    const cleanUpdates = cleanObject(userData);  // Nettoyer les données de l'utilisateur
  
    const response = await fetch(`http://localhost:8000/api/users/${userData._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(cleanUpdates)
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
  
    const updatedUser = await response.json();
    if (updatedUser.token) {  // Vérifiez si un nouveau token est renvoyé et mettez à jour si nécessaire
      user.token = updatedUser.token;  // Mettez à jour le token dans l'état utilisateur actuel
      localStorage.setItem('user', JSON.stringify({...user, token: updatedUser.token}));  // Mettez à jour le localStorage avec le nouveau token
    } else {
      localStorage.setItem('user', JSON.stringify(user));  // Pas de nouveau token, juste ré-enregistrer les données actuelles
    }
  
    setUser(user);  // Mettre à jour l'utilisateur dans l'état de l'application
  };
  

  const deleteAccount = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}` // Assurez-vous que l'authentification est correctement gérée
        }
      });
  
      if (!response.ok) {
        throw new Error('Could not delete the account.');
      }
  
      // Log out user after account deletion
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout,updateUserProfile, deleteAccount, fetchUserInvoices }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
