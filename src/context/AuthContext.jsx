import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null); // Utiliser null pour une valeur initiale claire

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const baseUrl = "http://localhost:8000";

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

  const requestPasswordReset = async (email) => {
    const response = await fetch(`${baseUrl}/api/users/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      throw new Error('Failed to send password reset email.');
    }
    await response.json(); // Traitez la réponse si nécessaire
  };
  

  const resetPassword = async (email, token, newPassword) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/forgot-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();
      console.log('Password reset successfully', data);
      navigate('/login'); // Redirige l'utilisateur après la réinitialisation
    } catch (error) {
      console.error('Error resetting password:', error);
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
    <AuthContext.Provider value={{ user, setUser, login, logout,requestPasswordReset, resetPassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);