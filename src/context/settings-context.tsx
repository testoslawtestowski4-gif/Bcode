'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  rows: number;
  setRows: (rows: number) => void;
  margin: number;
  setMargin: (margin: number) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [rows, setRows] = useState(5);
  const [margin, setMargin] = useState(10);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);

  return (
    <SettingsContext.Provider value={{
      rows,
      setRows,
      margin,
      setMargin,
      width,
      setWidth,
      height,
      setHeight,
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
