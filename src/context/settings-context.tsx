
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

type PrintOrientation = 'landscape' | 'portrait';

interface SettingsContextType {
  // Column View Settings
  columnHeight: number;
  setColumnHeight: (height: number) => void;
  
  // Grid View Settings
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  gridHeight: number;
  setGridHeight: (height: number) => void;
  isFocusMode: boolean;
  setIsFocusMode: (enabled: boolean) => void;
  focusModeThreshold: number;
  setFocusModeThreshold: (threshold: number) => void;
  focusModeVisibleRows: number;
  setFocusModeVisibleRows: (rows: number) => void;

  // Print Settings
  printFontSize: number;
  setPrintFontSize: (size: number) => void;
  printFontWeight: boolean;
  setPrintFontWeight: (bold: boolean) => void;
  printOrientation: PrintOrientation;
  setPrintOrientation: (orientation: PrintOrientation) => void;

  // Theme Settings
  theme: string;
  setTheme: (theme: string) => void;

  // Paste on Focus setting
  pasteOnFocus: boolean;
  setPasteOnFocus: (enabled: boolean) => void;

  // Team Work setting
  teamWorkEnabled: boolean;
  setTeamWorkEnabled: (enabled: boolean) => void;
  gamificationEnabled: boolean;
  setGamificationEnabled: (enabled: boolean) => void;

  // Statistics
  totalConsignmentBarcodes: number;
  setTotalConsignmentBarcodes: Dispatch<SetStateAction<number>>;
  totalContainerBarcodes: number;
  setTotalContainerBarcodes: Dispatch<SetStateAction<number>>;
  firstGenerationDate: string | null;
  setFirstGenerationDate: (date: string) => void;

  // Easter Egg Settings
  showSnowfall: boolean;
  setShowSnowfall: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Column settings
  const [columnHeight, _setColumnHeight] = useState(40);

  // Grid settings
  const [gridColumns, _setGridColumns] = useState(6);
  const [gridHeight, _setGridHeight] = useState(55);
  const [isFocusMode, _setIsFocusMode] = useState(false);
  const [focusModeThreshold, _setFocusModeThreshold] = useState(15);
  const [focusModeVisibleRows, _setFocusModeVisibleRows] = useState(1);
  
  // Print settings
  const [printFontSize, _setPrintFontSize] = useState(140);
  const [printFontWeight, _setPrintFontWeight] = useState(true);
  const [printOrientation, _setPrintOrientation] = useState<PrintOrientation>('landscape');

  // Theme settings
  const [theme, _setTheme] = useState('light');
  
  // Paste on Focus setting
  const [pasteOnFocus, _setPasteOnFocus] = useState(true);

  // Team Work setting
  const [teamWorkEnabled, _setTeamWorkEnabled] = useState(false);
  const [gamificationEnabled, _setGamificationEnabled] = useState(true);


  // Statistics
  const [totalConsignmentBarcodes, setTotalConsignmentBarcodes] = useState(0);
  const [totalContainerBarcodes, setTotalContainerBarcodes] = useState(0);
  const [firstGenerationDate, _setFirstGenerationDate] = useState<string | null>(null);

  // Easter Egg Settings
  const [showSnowfall, _setShowSnowfall] = useState(false);


  useEffect(() => {
    // --- Standard settings loading ---
    const storedTheme = localStorage.getItem('app-theme') || 'light';
    const storedPasteOnFocus = localStorage.getItem('paste-on-focus');
    const storedTeamWork = localStorage.getItem('team-work-enabled');
    const storedGamification = localStorage.getItem('gamification-enabled');
    const storedIsFocusMode = localStorage.getItem('is-focus-mode');
    const storedFocusThreshold = localStorage.getItem('focus-mode-threshold');
    const storedFocusRows = localStorage.getItem('focus-mode-visible-rows');
    const storedColumnHeight = localStorage.getItem('column-height');
    const storedGridHeight = localStorage.getItem('grid-height');
    const storedGridColumns = localStorage.getItem('grid-columns');
    const storedPrintFontSize = localStorage.getItem('print-font-size');
    const storedPrintFontWeight = localStorage.getItem('print-font-weight');
    const storedPrintOrientation = localStorage.getItem('print-orientation');
    const storedTotalConsignment = localStorage.getItem('total-consignment-barcodes');
    const storedTotalContainer = localStorage.getItem('total-container-barcodes');
    const storedFirstDate = localStorage.getItem('first-generation-date');
    _setTheme(storedTheme);

    // --- Snowfall Easter Egg Logic ---
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11 (December is 11)
    const currentYear = currentDate.getFullYear();
    const snowDisabledKey = `snowfall-disabled-${currentYear}`;

    if (currentMonth === 11) { // It's December
      const isSnowDisabled = localStorage.getItem(snowDisabledKey) === 'true';
      if (!isSnowDisabled) {
        _setShowSnowfall(true);
      }
    } else {
      // Not December, clear any old disabled keys to reset for next year
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('snowfall-disabled-')) {
          localStorage.removeItem(key);
        }
      });
    }

    // --- Rest of settings loading ---
    if (storedPasteOnFocus !== null) _setPasteOnFocus(storedPasteOnFocus === 'true');
    if (storedTeamWork !== null) _setTeamWorkEnabled(storedTeamWork === 'true');
    if (storedGamification !== null) _setGamificationEnabled(storedGamification === 'true');
    if (storedIsFocusMode !== null) _setIsFocusMode(storedIsFocusMode === 'true');
    if (storedFocusThreshold !== null) _setFocusModeThreshold(Number(storedFocusThreshold));
    if (storedFocusRows !== null) _setFocusModeVisibleRows(Number(storedFocusRows));
    if (storedColumnHeight !== null) _setColumnHeight(Number(storedColumnHeight));
    if (storedGridHeight !== null) _setGridHeight(Number(storedGridHeight));
    if (storedGridColumns !== null) _setGridColumns(Number(storedGridColumns));
    if (storedPrintFontSize !== null) _setPrintFontSize(Number(storedPrintFontSize));
    if (storedPrintFontWeight !== null) _setPrintFontWeight(storedPrintFontWeight === 'true');
    if (storedPrintOrientation !== null) _setPrintOrientation(storedPrintOrientation as PrintOrientation);
    if (storedTotalConsignment !== null) setTotalConsignmentBarcodes(Number(storedTotalConsignment));
    if (storedTotalContainer !== null) setTotalContainerBarcodes(Number(storedTotalContainer));
    if (storedFirstDate !== null) _setFirstGenerationDate(storedFirstDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('total-consignment-barcodes', String(totalConsignmentBarcodes));
  }, [totalConsignmentBarcodes]);
  
  useEffect(() => {
    localStorage.setItem('total-container-barcodes', String(totalContainerBarcodes));
  }, [totalContainerBarcodes]);

  const setTheme = useCallback((newTheme: string) => {
    localStorage.setItem('app-theme', newTheme);
    _setTheme(newTheme);
  }, []);

  const setPasteOnFocus = useCallback((enabled: boolean) => {
    localStorage.setItem('paste-on-focus', String(enabled));
    _setPasteOnFocus(enabled);
  }, []);

  const setTeamWorkEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem('team-work-enabled', String(enabled));
    _setTeamWorkEnabled(enabled);
  }, []);

  const setGamificationEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem('gamification-enabled', String(enabled));
    _setGamificationEnabled(enabled);
  }, []);
  
  const setIsFocusMode = useCallback((enabled: boolean) => {
    localStorage.setItem('is-focus-mode', String(enabled));
    _setIsFocusMode(enabled);
  }, []);

  const setFocusModeThreshold = useCallback((threshold: number) => {
    localStorage.setItem('focus-mode-threshold', String(threshold));
    _setFocusModeThreshold(threshold);
  }, []);

  const setFocusModeVisibleRows = useCallback((rows: number) => {
    localStorage.setItem('focus-mode-visible-rows', String(rows));
    _setFocusModeVisibleRows(rows);
  }, []);

  const setColumnHeight = useCallback((height: number) => {
    localStorage.setItem('column-height', String(height));
    _setColumnHeight(height);
  }, []);

  const setGridHeight = useCallback((height: number) => {
    localStorage.setItem('grid-height', String(height));
    _setGridHeight(height);
  }, []);
  
  const setGridColumns = useCallback((columns: number) => {
    localStorage.setItem('grid-columns', String(columns));
    _setGridColumns(columns);
  }, []);

  const setPrintFontSize = useCallback((size: number) => {
    localStorage.setItem('print-font-size', String(size));
    _setPrintFontSize(size);
  }, []);

  const setPrintFontWeight = useCallback((bold: boolean) => {
    localStorage.setItem('print-font-weight', String(bold));
    _setPrintFontWeight(bold);
  }, []);

  const setPrintOrientation = useCallback((orientation: PrintOrientation) => {
    localStorage.setItem('print-orientation', orientation);
    _setPrintOrientation(orientation);
  }, []);
  
  const setFirstGenerationDate = useCallback((date: string) => {
    if (!firstGenerationDate) {
      localStorage.setItem('first-generation-date', date);
      _setFirstGenerationDate(date);
    }
  }, [firstGenerationDate]);

  const setShowSnowfall = useCallback((enabled: boolean) => {
    _setShowSnowfall(enabled);
    if (!enabled) {
      const currentYear = new Date().getFullYear();
      localStorage.setItem(`snowfall-disabled-${currentYear}`, 'true');
    }
  }, []);

  return (
    <SettingsContext.Provider value={{
      columnHeight, setColumnHeight,
      gridColumns, setGridColumns,
      gridHeight, setGridHeight,
      isFocusMode, setIsFocusMode,
      focusModeThreshold, setFocusModeThreshold,
      focusModeVisibleRows, setFocusModeVisibleRows,
      printFontSize, setPrintFontSize,
      printFontWeight, setPrintFontWeight,
      printOrientation, setPrintOrientation,
      theme, setTheme,
      pasteOnFocus, setPasteOnFocus,
      teamWorkEnabled, setTeamWorkEnabled,
      gamificationEnabled, setGamificationEnabled,
      totalConsignmentBarcodes, setTotalConsignmentBarcodes,
      totalContainerBarcodes, setTotalContainerBarcodes,
      firstGenerationDate, setFirstGenerationDate,
      showSnowfall, setShowSnowfall,
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
