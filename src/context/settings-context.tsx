
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

  // Festive Effects
  showSnowfall: boolean;
  setShowSnowfall: (enabled: boolean) => void;

  // Statistics
  totalConsignmentBarcodes: number;
  setTotalConsignmentBarcodes: Dispatch<SetStateAction<number>>;
  totalContainerBarcodes: number;
  setTotalContainerBarcodes: Dispatch<SetStateAction<number>>;
  firstGenerationDate: string | null;
  setFirstGenerationDate: (date: string) => void;
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

  // Snowfall
  const [showSnowfall, _setShowSnowfall] = useState(false);


  // Statistics
  const [totalConsignmentBarcodes, setTotalConsignmentBarcodes] = useState(0);
  const [totalContainerBarcodes, setTotalContainerBarcodes] = useState(0);
  const [firstGenerationDate, _setFirstGenerationDate] = useState<string | null>(null);

  useEffect(() => {
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
    const storedShowSnowfall = localStorage.getItem('show-snowfall');

    _setTheme(storedTheme);
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
    if (storedShowSnowfall !== null) _setShowSnowfall(storedShowSnowfall === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('total-consignment-barcodes', String(totalConsignmentBarcodes));
  }, [totalConsignmentBarcodes]);
  
  useEffect(() => {
    localStorage.setItem('total-container-barcodes', String(totalContainerBarcodes));
  }, [totalContainerBarcodes]);

  const createSetter = useCallback(<T,>(setter: Dispatch<SetStateAction<T>>, key: string) => {
    return (value: T | ((prev: T) => T)) => {
      setter(prevValue => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevValue) : value;
        localStorage.setItem(key, String(newValue));
        return newValue;
      });
    };
  }, []);

  const setTheme = createSetter(_setTheme, 'app-theme');
  const setPasteOnFocus = createSetter(_setPasteOnFocus, 'paste-on-focus');
  const setTeamWorkEnabled = createSetter(_setTeamWorkEnabled, 'team-work-enabled');
  const setGamificationEnabled = createSetter(_setGamificationEnabled, 'gamification-enabled');
  const setIsFocusMode = createSetter(_setIsFocusMode, 'is-focus-mode');
  const setPrintFontWeight = createSetter(_setPrintFontWeight, 'print-font-weight');
  const setColumnHeight = createSetter(_setColumnHeight, 'column-height');
  const setGridHeight = createSetter(_setGridHeight, 'grid-height');
  const setGridColumns = createSetter(_setGridColumns, 'grid-columns');
  const setFocusModeThreshold = createSetter(_setFocusModeThreshold, 'focus-mode-threshold');
  const setFocusModeVisibleRows = createSetter(_setFocusModeVisibleRows, 'focus-mode-visible-rows');
  const setPrintFontSize = createSetter(_setPrintFontSize, 'print-font-size');
  const setPrintOrientation = createSetter<PrintOrientation>(_setPrintOrientation, 'print-orientation');
  const setShowSnowfall = createSetter(_setShowSnowfall, 'show-snowfall');

  const setFirstGenerationDate = useCallback((date: string) => {
    if (!firstGenerationDate) {
      localStorage.setItem('first-generation-date', date);
      _setFirstGenerationDate(date);
    }
  }, [firstGenerationDate]);

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
      showSnowfall, setShowSnowfall,
      totalConsignmentBarcodes, setTotalConsignmentBarcodes,
      totalContainerBarcodes, setTotalContainerBarcodes,
      firstGenerationDate, setFirstGenerationDate,
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
