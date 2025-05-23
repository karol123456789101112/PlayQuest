import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setFirstName(null);
      } else {
        setIsAuthenticated(true);
        setUserRole(decodedToken.role);
        setUserId(decodedToken.userId);
        setFirstName(decodedToken.firstName);
      }
    }
    setLoading(false);
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    setIsAuthenticated(true);
    setUserRole(decodedToken.role);
    setUserId(decodedToken.userId);
    setFirstName(decodedToken.firstName);

    // Migracja koszyka gościa do konta użytkownika
    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await fetch(`http://localhost:8080/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: decodedToken.userId,
              gameId: item.gameId,
              quantity: item.quantity
            })
          });
        } catch (err) {
          console.error("Error while adding games to cart:", err);
        }
      }
      localStorage.removeItem('guestCart');
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, firstName, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
