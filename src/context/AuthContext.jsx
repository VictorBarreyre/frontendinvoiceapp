import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null); // Utiliser null pour une valeur initiale claire

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      // Complétez l'utilisateur stocké avec les valeurs par défaut si certaines valeurs sont manquantes
      const completeUser = {
        email: storedUser.email || '',
        name: storedUser.name || '',
        adresse: storedUser.adresse || '',
        siret: storedUser.siret || '',
        iban: storedUser.iban || '',
        ...storedUser // Cela garantit que les valeurs non spécifiées seront prises depuis le localStorage
      };
      setUser(completeUser);
    }
  }, []);  

const login = (userData) => {
    // Assurez-vous que toutes les propriétés nécessaires sont incluses lors du login
    const completeUser = {
      email: userData.email || '',
      name: userData.name || '',
      adresse: userData.adresse || '',
      siret: userData.siret || '',
      iban: userData.iban || '',
      ...userData
    };
    setUser(completeUser);
    localStorage.setItem('user', JSON.stringify(completeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };


  const updateUserProfile = async (updates) => {
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updates)
      });
      const updatedUser = await response.json();
      if (!response.ok) {
        throw new Error(updatedUser.message || 'Failed to update profile');
      }
      setUser(updatedUser);  // Update local user state
      localStorage.setItem('user', JSON.stringify(updatedUser));  // Update local storage
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
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
    <AuthContext.Provider value={{ user, setUser, login, logout,updateUserProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
