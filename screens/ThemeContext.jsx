import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // optional default
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const theme = {
    isDarkTheme,
    colors: {
      background: isDarkTheme ? '#121212' : '#f8f9fa',
      text: isDarkTheme ? '#ffffff' : '#000000',
      card: isDarkTheme ? '#1f1f1f' : '#ffffff',
      accent: '#2196F3',
    },
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
