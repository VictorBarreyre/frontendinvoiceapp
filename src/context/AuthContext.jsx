import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null); // Utiliser null pour une valeur initiale claire

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
    <AuthContext.Provider value={{ user, setUser, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
