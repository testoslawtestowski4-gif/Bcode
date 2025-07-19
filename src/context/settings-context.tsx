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
  
  // Performance Settings
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;

  // Paste on Focus setting
  pasteOnFocus: boolean;
  setPasteOnFocus: (enabled: boolean) => void;
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

  // Performance settings
  const [animationsEnabled, _setAnimationsEnabled] = useState(false);
  
  // Paste on Focus setting
  const [pasteOnFocus, _setPasteOnFocus] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    const storedAnimations = localStorage.getItem('animations-enabled');
    const storedPasteOnFocus = localStorage.getItem('paste-on-focus');

    if (storedAnimations !== null) {
        _setAnimationsEnabled(storedAnimations === 'true');
    } else {
        // Default to speed mode
        _setAnimationsEnabled(false);
        localStorage.setItem('animations-enabled', 'false');
    }

    if (storedPasteOnFocus !== null) {
      _setPasteOnFocus(storedPasteOnFocus === 'true');
    }

    _setTheme(storedTheme);
  }, []);

  const setTheme = (newTheme: string) => {
    localStorage.setItem('app-theme', newTheme);
    _setTheme(newTheme);
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    localStorage.setItem('animations-enabled', String(enabled));
    _setAnimationsEnabled(enabled);
  }

  const setPasteOnFocus = (enabled: boolean) => {
    localStorage.setItem('paste-on-focus', String(enabled));
    _setPasteOnFocus(enabled);
  }


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'pink-theme', 'sleek-theme', 'xmas-theme');

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
      animationsEnabled,
      setAnimationsEnabled,
      pasteOnFocus,
      setPasteOnFocus
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
