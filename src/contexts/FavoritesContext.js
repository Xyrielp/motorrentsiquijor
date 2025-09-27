import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(userFavorites);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addToFavorites = (motorcycleId) => {
    if (!user) return false;
    
    if (!favorites.includes(motorcycleId)) {
      const newFavorites = [...favorites, motorcycleId];
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      return true;
    }
    return false;
  };

  const removeFromFavorites = (motorcycleId) => {
    if (!user) return false;
    
    const newFavorites = favorites.filter(id => id !== motorcycleId);
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    return true;
  };

  const isFavorite = (motorcycleId) => {
    return favorites.includes(motorcycleId);
  };

  const toggleFavorite = (motorcycleId) => {
    if (isFavorite(motorcycleId)) {
      return removeFromFavorites(motorcycleId);
    } else {
      return addToFavorites(motorcycleId);
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};