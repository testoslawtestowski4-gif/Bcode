'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  // Column View Settings
  columnRows: number;
  setColumnRows: (rows: number) => void;
  columnMargin: number;
  setColumnMargin: (margin: number) => void;
  columnHeight: number;
  setColumnHeight: (height: number) => void;
  
  // Grid View Settings
  gridRows: number;
  setGridRows: (rows: number) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridMargin: number;
  setGridMargin: (margin: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;

  // Theme Settings
  theme: string;
  setTheme: (theme: string) => void;

  // Easter Egg
  isFunnyMode: boolean;
  toggleFunnyMode: () => void;
  
  // Performance Settings
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Column settings
  const [columnRows, setColumnRows] = useState(1);
  const [columnMargin, setColumnMargin] = useState(0);
  const [columnHeight, setColumnHeight] = useState(40);

  // Grid settings
  const [gridRows, setGridRows] = useState(1);
  const [gridColumns, setGridColumns] = useState(6);
  const [gridMargin, setGridMargin] = useState(10);
  const [gridHeight, setGridHeight] = useState(55);

  // Theme settings
  const [theme, _setTheme] = useState('light');

  // Easter egg setting
  const [isFunnyMode, setIsFunnyMode] = useState(false);
  const toggleFunnyMode = () => setIsFunnyMode(prev => !prev);
  
  // Performance settings
  const [animationsEnabled, _setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    const storedFunnyMode = localStorage.getItem('funny-mode') === 'true';
    const storedAnimations = localStorage.getItem('animations-enabled');

    if (storedAnimations !== null) {
        _setAnimationsEnabled(storedAnimations === 'true');
    }

    if (storedFunnyMode) {
      setIsFunnyMode(true);
      _setTheme('clown-theme');
    } else {
      _setTheme(storedTheme);
    }
  }, []);

  const setTheme = (newTheme: string) => {
    const isClown = newTheme === 'clown-theme';
    if (isClown) {
      localStorage.setItem('funny-mode', 'true');
    } else {
      localStorage.setItem('app-theme', newTheme);
      localStorage.removeItem('funny-mode');
      setIsFunnyMode(false);
    }
    _setTheme(newTheme);
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    localStorage.setItem('animations-enabled', String(enabled));
    _setAnimationsEnabled(enabled);
  }


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'pink-theme', 'clown-theme');

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
      columnMargin,
      setColumnMargin,
      columnHeight,
      setColumnHeight,
      gridRows,
      setGridRows,
      gridColumns,
      setGridColumns,
      gridMargin,
      setGridMargin,
      gridHeight,
      setGridHeight,
      theme,
      setTheme,
      isFunnyMode,
      toggleFunnyMode,
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
