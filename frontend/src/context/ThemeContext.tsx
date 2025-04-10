import React from 'react';

interface ThemeContextType {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  mode: 'dark',
  setMode: () => {},
}); 