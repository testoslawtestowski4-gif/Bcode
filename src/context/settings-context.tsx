'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Column settings
  const [columnRows, setColumnRows] = useState(5);
  const [columnMargin, setColumnMargin] = useState(10);
  const [columnWidth, setColumnWidth] = useState(2);
  const [columnHeight, setColumnHeight] = useState(80);

  // Grid settings
  const [gridRows, setGridRows] = useState(5);
  const [gridColumns, setGridColumns] = useState(4);
  const [gridMargin, setGridMargin] = useState(5);
  const [gridWidth, setGridWidth] = useState(1.5);
  const [gridHeight, setGridHeight] = useState(40);

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
      setGridHeight
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
