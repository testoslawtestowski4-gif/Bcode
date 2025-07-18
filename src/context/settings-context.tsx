'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  // Column View Settings
  columnRows: number;
  setColumnRows: (rows: number) => void;
  columnHeight: number;
  setColumnHeight: (height: number) => void;
  
  // Grid View Settings
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;

  // Theme Settings
  theme: string;
  setTheme: (theme: string) => void;

  // Easter Eggs
  isFunnyMode: boolean;
  toggleFunnyMode: () => void;
  isXmasMode: boolean;
  toggleXmasMode: () => void;
  
  // Performance Settings
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Column settings
  const [columnRows, setColumnRows] = useState(1);
  const [columnHeight, setColumnHeight] = useState(40);

  // Grid settings
  const [gridColumns, setGridColumns] = useState(6);
  const [gridHeight, setGridHeight] = useState(55);

  // Theme settings
  const [theme, _setTheme] = useState('light');

  // Easter egg settings
  const [isFunnyMode, setIsFunnyMode] = useState(false);
  const toggleFunnyMode = () => setIsFunnyMode(prev => !prev);
  const [isXmasMode, setIsXmasMode] = useState(false);
  const toggleXmasMode = () => setIsXmasMode(prev => !prev);
  
  // Performance settings
  const [animationsEnabled, _setAnimationsEnabled] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    const storedFunnyMode = localStorage.getItem('funny-mode') === 'true';
    const storedXmasMode = localStorage.getItem('xmas-mode') === 'true';
    const storedAnimations = localStorage.getItem('animations-enabled');

    if (storedAnimations !== null) {
        _setAnimationsEnabled(storedAnimations === 'true');
    } else {
        // Default to speed mode
        _setAnimationsEnabled(false);
        localStorage.setItem('animations-enabled', 'false');
    }

    if (storedFunnyMode) {
      setIsFunnyMode(true);
      _setTheme('clown-theme');
    } else if (storedXmasMode) {
      setIsXmasMode(true);
      _setTheme('xmas-theme');
    }
    else {
      _setTheme(storedTheme);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    const isClown = newTheme === 'clown-theme';
    const isXmas = newTheme === 'xmas-theme';

    if (isClown) {
      localStorage.setItem('funny-mode', 'true');
      localStorage.removeItem('xmas-mode');
    } else if (isXmas) {
      localStorage.setItem('xmas-mode', 'true');
      localStorage.removeItem('funny-mode');
    }
    else {
      localStorage.setItem('app-theme', newTheme);
      localStorage.removeItem('funny-mode');
      localStorage.removeItem('xmas-mode');
      setIsFunnyMode(false);
      setIsXmasMode(false);
    }
    _setTheme(newTheme);
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    localStorage.setItem('animations-enabled', String(enabled));
    _setAnimationsEnabled(enabled);
  }


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'pink-theme', 'clown-theme', 'sleek-theme', 'xmas-theme');

    if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (animationsEnabled) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }
  }, [animationsEnabled]);


  return (
    <SettingsContext.Provider value={{
      columnRows,
      setColumnRows,
      columnHeight,
      setColumnHeight,
      gridColumns,
      setGridColumns,
      gridHeight,
      setGridHeight,
      theme,
      setTheme,
      isFunnyMode,
      toggleFunnyMode,
      isXmasMode,
      toggleXmasMode,
      animationsEnabled,
      setAnimationsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
