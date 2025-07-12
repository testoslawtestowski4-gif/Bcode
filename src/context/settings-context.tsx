'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  // Column View Settings
  columnRows: number;
  setColumnRows: (rows: number) => void;
  columnMargin: number;
  setColumnMargin: (margin: number) => void;
  columnWidth: number;
  setColumnWidth: (width: number) => void;
  columnHeight: number;
  setColumnHeight: (height: number) => void;
  
  // Grid View Settings
  gridRows: number;
  setGridRows: (rows: number) => void;
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridMargin: number;
  setGridMargin: (margin: number) => void;
  gridWidth: number;
  setGridWidth: (width: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;

  // Theme Settings
  theme: string;
  setTheme: (theme: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Column settings
  const [columnRows, setColumnRows] = useState(1);
  const [columnMargin, setColumnMargin] = useState(0);
  const [columnWidth, setColumnWidth] = useState(1.5);
  const [columnHeight, setColumnHeight] = useState(60);

  // Grid settings
  const [gridRows, setGridRows] = useState(1);
  const [gridColumns, setGridColumns] = useState(5);
  const [gridMargin, setGridMargin] = useState(10);
  const [gridWidth, setGridWidth] = useState(2.0);
  const [gridHeight, setGridHeight] = useState(55);

  // Theme settings
  const [theme, _setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    _setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'pink-theme');

    if (theme !== 'light') {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: string) => {
    localStorage.setItem('app-theme', newTheme);
    _setTheme(newTheme);
  };


  return (
    <SettingsContext.Provider value={{
      columnRows,
      setColumnRows,
      columnMargin,
      setColumnMargin,
      columnWidth,
      setColumnWidth,
      columnHeight,
      setColumnHeight,
      gridRows,
      setGridRows,
      gridColumns,
      setGridColumns,
      gridMargin,
      setGridMargin,
      gridWidth,
      setGridWidth,
      gridHeight,
      setGridHeight,
      theme,
      setTheme
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
