'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  // Column View Settings
  columnHeight: number;
  setColumnHeight: (height: number) => void;
  
  // Grid View Settings
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;
  focusModeThreshold: number;
  setFocusModeThreshold: (threshold: number) => void;
  focusModeVisibleRows: number;
  setFocusModeVisibleRows: (rows: number) => void;

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
  const [columnHeight, _setColumnHeight] = useState(40);

  // Grid settings
  const [gridColumns, setGridColumns] = useState(6);
  const [gridHeight, _setGridHeight] = useState(55);
  const [focusModeThreshold, _setFocusModeThreshold] = useState(15);
  const [focusModeVisibleRows, _setFocusModeVisibleRows] = useState(1);

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
    const storedFocusThreshold = localStorage.getItem('focus-mode-threshold');
    const storedFocusRows = localStorage.getItem('focus-mode-visible-rows');
    const storedColumnHeight = localStorage.getItem('column-height');
    const storedGridHeight = localStorage.getItem('grid-height');

    if (storedAnimations !== null) {
        _setAnimationsEnabled(storedAnimations === 'true');
    } else {
        _setAnimationsEnabled(false);
        localStorage.setItem('animations-enabled', 'false');
    }

    if (storedPasteOnFocus !== null) {
      _setPasteOnFocus(storedPasteOnFocus === 'true');
    }

    if (storedFocusThreshold !== null) {
      _setFocusModeThreshold(Number(storedFocusThreshold));
    }

    if (storedFocusRows !== null) {
      _setFocusModeVisibleRows(Number(storedFocusRows));
    }

    if (storedColumnHeight !== null) {
      _setColumnHeight(Number(storedColumnHeight));
    }
    
    if (storedGridHeight !== null) {
      _setGridHeight(Number(storedGridHeight));
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

  const setFocusModeThreshold = (threshold: number) => {
    localStorage.setItem('focus-mode-threshold', String(threshold));
    _setFocusModeThreshold(threshold);
  };

  const setFocusModeVisibleRows = (rows: number) => {
    localStorage.setItem('focus-mode-visible-rows', String(rows));
    _setFocusModeVisibleRows(rows);
  };

  const setColumnHeight = (height: number) => {
    localStorage.setItem('column-height', String(height));
    _setColumnHeight(height);
  };

  const setGridHeight = (height: number) => {
    localStorage.setItem('grid-height', String(height));
    _setGridHeight(height);
  };


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
      columnHeight,
      setColumnHeight,
      gridColumns,
      setGridColumns,
      gridHeight,
      setGridHeight,
      focusModeThreshold,
      setFocusModeThreshold,
      focusModeVisibleRows,
      setFocusModeVisibleRows,
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
