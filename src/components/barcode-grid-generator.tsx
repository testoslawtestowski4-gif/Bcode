
'use client';

import { useState, useEffect, useRef, useMemo, Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes, BarChart2, ExternalLink, Printer, ListChecks, LayoutGrid } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { BarcodeData, isValidBarcode } from './barcode-column-generator';
import { cn } from '@/lib/utils';
import { ConsignmentSwitcher } from './consignment-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ParsedBarcode {
  value: string;
  context: string;
}

interface BarcodeGridGeneratorProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  onConsignmentCodeDetected: (code: string) => void;
  activeConsignmentCodeValue: string | null;
  isTeamWorkActive: boolean;
  setContainerBarcodeCount: Dispatch<SetStateAction<number>>;
  allConsignmentBarcodes: BarcodeData[];
  activeConsignmentBarcode: string | null;
  setActiveConsignmentBarcode: (id: string | null) => void;
}

export function BarcodeGridGenerator({ 
  inputValue,
  setInputValue,
  onConsignmentCodeDetected, 
  activeConsignmentCodeValue,
  isTeamWorkActive,
  setContainerBarcodeCount,
  allConsignmentBarcodes,
  activeConsignmentBarcode,
  setActiveConsignmentBarcode
}: BarcodeGridGeneratorProps) {
  const { 
    gridHeight, gridColumns, setGridColumns, 
    pasteOnFocus, setPasteOnFocus, focusModeThreshold, focusModeVisibleRows,
  } = useSettings();
  
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 4, 6];

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  const [focusedRowLeft, setFocusedRowLeft] = useState(0);
  const [focusedRowRight, setFocusedRowRight] = useState(0);

  
  const containerCardRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const leftScrollContainerRef = useRef<HTMLDivElement>(null);
  const rightScrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const parsedBarcodes = useMemo(() => {
    if (!debouncedValue) {
      return [];
    }

    const hasWebDropoff = /web-dropoff/i.test(debouncedValue);
    const matches = new Map<string, ParsedBarcode>();

    if (hasWebDropoff) {
      // Mode 1: Parse from "web-dropoff" context
      const regex = /(\d{7}).*?((?:\d-\w\d-|\w+-)?web-dropoff)/gi;
      let match;
      while ((match = regex.exec(debouncedValue)) !== null) {
        const value = match[1];
        const context = match[2].toLowerCase();
        if (!matches.has(value)) {
          matches.set(value, { value, context });
        }
      }
    } else {
      // Mode 2: Parse standalone 7-digit numbers
      const regex = /\b(\d{7})\b/g;
      let match;
      while ((match = regex.exec(debouncedValue)) !== null) {
        const value = match[1];
        if (!matches.has(value)) {
          matches.set(value, { value, context: 'direct' });
        }
      }
    }
    
    return Array.from(matches.values());
  }, [debouncedValue]);

  const barcodes = useMemo(() => parsedBarcodes.map(b => b.value), [parsedBarcodes]);
  
  // Effect to update parent component with barcode count
  useEffect(() => {
    setContainerBarcodeCount(barcodes.length);
  }, [barcodes.length, setContainerBarcodeCount]);

  const midPoint = Math.ceil(barcodes.length / 2);
  const leftBarcodes = barcodes.slice(0, midPoint);
  const rightBarcodes = barcodes.slice(midPoint);


  const levelIJPatterns = ['2-b1-web-dropoff', '2-b2-web-dropoff', '2-b3-web-dropoff'];
  const levelKLPatterns = ['2-c1-web-dropoff', '2-c2-web-dropoff', '2-c3-web-dropoff'];
  const levelCPatterns = ['1-c1-web-dropoff', '1-c2-web-dropoff', '1-c3-web-dropoff', '1-c4-web-dropoff'];
  const groundFloorPatterns = ['apr-web-dropoff', 'web-dropoff'];

  const getBarcodeLevel = (context: string) => {
    if (levelIJPatterns.includes(context)) return 'I&J';
    if (levelKLPatterns.includes(context)) return 'K&L';
    if (levelCPatterns.includes(context)) return 'Level C';
    if (groundFloorPatterns.includes(context)) return 'Ground Floor';
    return 'Unknown';
  };
  
  const statistics = useMemo(() => {
    const stats = {
      levelIJ: 0,
      levelKL: 0,
      levelC: 0,
      groundFloor: 0,
    };
    
    const shouldCalculate = !parsedBarcodes.some(b => b.context === 'direct');
    if (!shouldCalculate && parsedBarcodes.length > 0) {
      return null;
    }

    for (const barcode of parsedBarcodes) {
        const level = getBarcodeLevel(barcode.context);
        if (level === 'I&J') stats.levelIJ++;
        else if (level === 'K&L') stats.levelKL++;
        else if (level === 'Level C') stats.levelC++;
        else if (level === 'Ground Floor') stats.groundFloor++;
    }

    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedBarcodes]);

  const handleOpenStatsPage = () => {
    if (!statistics) return;
  
    const now = new Date();
    const generationDate = format(now, 'yyyy-MM-dd');
    const generationTime = format(now, 'HH:mm:ss');
  
    const groupedBarcodes: { [key: string]: ParsedBarcode[] } = {
      'I&J': [],
      'K&L': [],
      'Level C': [],
      'Ground Floor': [],
      'Unknown': []
    };
  
    parsedBarcodes.forEach(barcode => {
      const level = getBarcodeLevel(barcode.context);
      groupedBarcodes[level].push(barcode);
    });

    const barcodeDetailsHtml = Object.entries(groupedBarcodes)
      .filter(([, barcodes]) => barcodes.length > 0)
      .map(([level, barcodes]) => `
      <div class="level-group">
        <div class="level-header">
          <h3>${level} (${barcodes.length})</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Web Dropoff Location</th>
            </tr>
          </thead>
          <tbody>
            ${barcodes.map(b => `
              <tr>
                <td>${b.value}</td>
                <td>${b.context}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
    
    const consignmentHtml = activeConsignmentCodeValue ? `
    <div class="consignment-info">
        <span class="label">Consignment Code:</span>
        <span class="value">${activeConsignmentCodeValue}</span>
    </div>` : '';
  
    const statsHtml = `
      <html>
        <head>
          <title>Barcode Generation Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f8f9fa; color: #212529; }
            .container { max-width: 900px; margin: auto; background: white; padding: 2.5rem; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e9ecef; padding-bottom: 1.5rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem; }
            h1 { color: #343a40; margin: 0; font-size: 2rem; }
            h2 { color: #495057; border-bottom: 1px solid #dee2e6; padding-bottom: 0.5rem; margin-top: 2.5rem; margin-bottom: 1.5rem; }
            h3 { color: #495057; margin: 0; font-size: 1.2rem; }
            .meta-info { text-align: right; }
            .meta-info .date, .meta-info .time { font-size: 1rem; color: #6c757d; }
            .meta-info .time { font-weight: bold; }
            .consignment-info { font-size: 1.1rem; color: #495057; background-color: #e9ecef; padding: 0.5rem 1rem; border-radius: 6px; }
            .consignment-info .label { font-weight: 600; }
            .consignment-info .value { font-family: monospace; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 0.8rem 1rem; border-bottom: 1px solid #e9ecef; }
            th { background-color: #f8f9fa; font-weight: 600; }
            tbody tr:nth-child(even) { background-color: #f8f9fa; }
            tr:hover { background-color: #f1f3f5; }
            .summary-container {
                display: flex;
                align-items: baseline;
                justify-content: flex-start;
                gap: 0.5rem;
                padding: 1rem 0;
                flex-wrap: wrap;
                border-top: 1px solid #e9ecef;
                border-bottom: 1px solid #e9ecef;
            }
            .summary-header {
                display: flex;
                align-items: baseline;
                gap: 0.5rem;
                padding-right: 1.5rem;
            }
            .total-label {
                font-size: 1.1rem;
                color: #495057;
                font-weight: 600;
            }
            .total-count {
                font-size: 1.2rem;
                font-weight: bold;
                color: #343a40;
            }
            .summary-details {
                display: flex;
                gap: 1.5rem;
                flex-wrap: wrap;
                align-items: baseline;
            }
            .summary-item {
                display: flex;
                align-items: baseline;
                gap: 0.4rem;
            }
            .summary-item .label {
                font-size: 1rem;
                color: #6c757d;
            }
            .summary-item .count {
                font-size: 1.1rem;
                font-weight: 600;
                color: #343a40;
            }
            .level-group { 
              margin-bottom: 2rem;
              background-color: white;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              overflow: hidden;
            }
            .level-header { background-color: #f8f9fa; padding: 1rem 1.5rem; border-bottom: 1px solid #dee2e6; }
            .print-button {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 5px;
            }
            @media print {
                body { padding: 0.5rem; background-color: #ffffff; }
                .container { box-shadow: none; border: none; padding: 0; }
                .no-print { display: none; }
                .level-group { page-break-inside: avoid; }
                tr:hover { background-color: transparent; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
                <div>
                  <h1>Barcode Generation Report</h1>
                  ${consignmentHtml}
                </div>
                <div class="meta-info no-print">
                    <button class="print-button" onclick="window.print()">Print Report</button>
                    <div class="date">Date: ${generationDate}</div>
                    <div class="time">Time: ${generationTime}</div>
                </div>
            </div>
            
            <h2>Summary</h2>
            <div class="summary-container">
              <div class="summary-header">
                  <span class="total-label">Total:</span>
                  <span class="total-count">${barcodes.length}</span>
              </div>
              <div class="summary-details">
                  <div class="summary-item"><span class="label">I&J:</span><span class="count">${statistics.levelIJ}</span></div>
                  <div class="summary-item"><span class="label">K&L:</span><span class="count">${statistics.levelKL}</span></div>
                  <div class="summary-item"><span class="label">Level C:</span><span class="count">${statistics.levelC}</span></div>
                  <div class="summary-item"><span class="label">Ground:</span><span class="count">${statistics.groundFloor}</span></div>
              </div>
            </div>

            <h2>Barcode Details</h2>
            ${barcodeDetailsHtml}
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(statsHtml);
      printWindow.document.close();
    }
  };

  const handlePrintStats = () => {
    if (!statistics) return;

    const now = new Date();
    const generationDate = format(now, 'yyyy-MM-dd');
    const generationTime = format(now, 'HH:mm:ss');
    const total = barcodes.length;

    const groupedBarcodes: { [key: string]: ParsedBarcode[] } = {
      'I&J': [],
      'K&L': [],
      'Level C': [],
      'Ground Floor': [],
      'Unknown': []
    };
  
    parsedBarcodes.forEach(barcode => {
      const level = getBarcodeLevel(barcode.context);
      groupedBarcodes[level].push(barcode);
    });

    const barcodeDetailsHtml = Object.entries(groupedBarcodes)
      .filter(([, barcodes]) => barcodes.length > 0)
      .map(([level, barcodes]) => `
      <div class="level-group">
        <h3>${level} (${barcodes.length})</h3>
        <table>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${barcodes.map(b => `
              <tr>
                <td>${b.value}</td>
                <td>${b.context}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');
    
    const consignmentHtml = activeConsignmentCodeValue ? `
    <div class="summary-item">
      <span class="label">Consignment:</span>
      <span class="count">${activeConsignmentCodeValue}</span>
    </div>` : '';

    const statsHtml = `
      <html>
        <head>
          <title>Barcode Statistics - Print</title>
          <style>
            @media print {
              @page { size: A4; margin: 1.5cm; }
              body { -webkit-print-color-adjust: exact; }
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #212529; 
            }
            .container { max-width: 100%; margin: auto; }
            h1, h2, h3 { color: #343a40; }
            h1 { font-size: 1.8rem; text-align: center; border-bottom: 2px solid #dee2e6; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
            h2 { font-size: 1.2rem; margin-top: 1.5rem; border-bottom: 1px solid #dee2e6; padding-bottom: 0.5rem; margin-bottom: 1rem; }
            h3 { font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .time-info { text-align: center; margin-bottom: 1rem; color: #6c757d; font-size: 0.9rem; }
            
            .summary-bar {
              display: flex;
              justify-content: flex-start;
              gap: 1rem;
              align-items: center;
              flex-wrap: wrap;
              padding: 0.5rem 0;
              font-size: 0.9rem;
              margin-bottom: 1rem;
              page-break-inside: avoid;
              border-top: 1px solid #e9ecef;
              border-bottom: 1px solid #e9ecef;
            }
            .summary-item { display: flex; align-items: baseline; padding-right: 1rem; }
            .summary-item:not(:last-child) { border-right: 1px solid #d3d3d3; }
            .summary-item .label { color: #495057; margin-right: 0.3em; }
            .summary-item .count { font-weight: bold; color: #343a40; }
            
            .level-group { page-break-inside: avoid; margin-bottom: 1.5rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #e9ecef; font-size: 0.9rem; }
            th { background-color: #f8f9fa !important; font-weight: 600; }
            tbody tr:nth-child(even) { background-color: #f8f9fa !important; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Barcode Statistics</h1>
            <div class="time-info">
              ${generationDate} &mdash; ${generationTime}
            </div>
            
            <h2>Summary</h2>
            <div class="summary-bar">
                <div class="summary-item">
                    <span class="label">Total:</span>
                    <span class="count">${total}</span>
                </div>
                ${consignmentHtml}
                <div class="summary-item"><span class="label">I&J:</span><span class="count">${statistics.levelIJ}</span></div>
                <div class="summary-item"><span class="label">K&L:</span><span class="count">${statistics.levelKL}</span></div>
                <div class="summary-item"><span class="label">Level C:</span><span class="count">${statistics.levelC}</span></div>
                <div class="summary-item"><span class="label">Ground:</span><span class="count">${statistics.groundFloor}</span></div>
            </div>

            <h2>Barcode Details</h2>
            ${barcodeDetailsHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(statsHtml);
      printWindow.document.close();
    }
  };


  useEffect(() => {
    if (barcodes.length > focusModeThreshold) {
      setIsFocusMode(true);
    } else {
      setIsFocusMode(false);
    }
    setFocusedRow(0);
    setFocusedRowLeft(0);
    setFocusedRowRight(0);
  }, [barcodes.length, focusModeThreshold]);

  useEffect(() => {
    const hasBarcodes = barcodes.length > 0;
    if (hasBarcodes) {
        setTimeout(() => {
            containerCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [barcodes.length]);

  useEffect(() => {
    if (isTeamWorkActive) {
        setTimeout(() => {
            containerCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [isTeamWorkActive]);

  useEffect(() => {
    if (!isFocusMode || barcodes.length === 0) return;
  
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return;
      }
      
      event.preventDefault();
  
      if (isTeamWorkActive) {
        const teamWorkGridColumns = 4;
        // Team Work Mode Controls
        const totalRowsLeft = Math.ceil(leftBarcodes.length / teamWorkGridColumns);
        const rowChunksLeft = Math.ceil(totalRowsLeft / focusModeVisibleRows);
  
        const totalRowsRight = Math.ceil(rightBarcodes.length / teamWorkGridColumns);
        const rowChunksRight = Math.ceil(totalRowsRight / focusModeVisibleRows);
  
        switch (event.code) {
          case 'Space':
            if (rowChunksLeft > 0) setFocusedRowLeft(prev => (prev + 1) % rowChunksLeft);
            break;
          case 'KeyZ':
            if (rowChunksLeft > 0) setFocusedRowLeft(prev => (prev - 1 + rowChunksLeft) % rowChunksLeft);
            break;
          case 'ArrowDown':
          case 'ArrowRight':
            if (rowChunksRight > 0) setFocusedRowRight(prev => (prev + 1) % rowChunksRight);
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            if (rowChunksRight > 0) setFocusedRowRight(prev => (prev - 1 + rowChunksRight) % rowChunksRight);
            break;
        }
  
      } else {
        // Standard Mode Controls
        const totalRows = Math.ceil(barcodes.length / gridColumns);
        const rowChunks = Math.ceil(totalRows / focusModeVisibleRows);
  
        if (rowChunks > 0) {
            switch (event.code) {
                case 'Space':
                case 'ArrowDown':
                case 'ArrowRight':
                    setFocusedRow(prev => (prev + 1) % rowChunks);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    setFocusedRow(prev => (prev - 1 + rowChunks) % rowChunks);
                    break;
            }
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode, isTeamWorkActive, barcodes.length, leftBarcodes.length, rightBarcodes.length, gridColumns, focusModeVisibleRows]);

  const scrollToRow = (
    scrollContainer: HTMLDivElement | null, 
    rowRefs: (HTMLDivElement | null)[], 
    focusedRowIndex: number, 
    itemsPerChunk: number
  ) => {
    if (!scrollContainer) return;
  
    const chunkToScrollTo = Math.max(0, focusedRowIndex - 1);
    const firstIndexOfChunk = chunkToScrollTo * itemsPerChunk;
    const rowElement = rowRefs[firstIndexOfChunk];
  
    if (rowElement) {
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const rowTop = rowElement.getBoundingClientRect().top;
        const scrollOffset = rowTop - containerTop + scrollContainer.scrollTop;
  
        scrollContainer.scrollTo({
            top: scrollOffset,
            behavior: 'smooth',
        });
    } else if (focusedRowIndex === 0) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isFocusMode && !isTeamWorkActive) {
      const firstIndexOfChunk = focusedRow * focusModeVisibleRows * gridColumns;
      const rowElement = rowRefs.current[firstIndexOfChunk];
      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [focusedRow, isFocusMode, gridColumns, focusModeVisibleRows, isTeamWorkActive]);
  
  useEffect(() => {
    if (isFocusMode && isTeamWorkActive) {
      scrollToRow(leftScrollContainerRef.current, leftRowRefs.current, focusedRowLeft, focusModeVisibleRows * 4);
    }
  }, [focusedRowLeft, isFocusMode, isTeamWorkActive, focusModeVisibleRows]);

  useEffect(() => {
    if (isFocusMode && isTeamWorkActive) {
      scrollToRow(rightScrollContainerRef.current, rightRowRefs.current, focusedRowRight, focusModeVisibleRows * 4);
    }
  }, [focusedRowRight, isFocusMode, isTeamWorkActive, focusModeVisibleRows]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);

    const potentialCodes = value.match(/[a-zA-Z0-9]+/g) || [];
    const validConsignmentCodes = potentialCodes.filter(isValidBarcode);
    if (validConsignmentCodes.length > 0) {
      // Find the last valid code in the pasted text, as it's often the most relevant one.
      onConsignmentCodeDetected(validConsignmentCodes[validConsignmentCodes.length - 1]);
    }
  };

  const handleTextareaClick = async () => {
    if (!pasteOnFocus) return;

    try {
      setInputValue(''); // Explicitly clear the input value first
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text);
        toast({
          title: "Pasted from clipboard",
          description: `Pasted ${text.length} characters into 'Container' field.`,
        });

        const potentialCodes = text.match(/[a-zA-Z0-9]+/g) || [];
        const validConsignmentCodes = potentialCodes.filter(isValidBarcode);
        if (validConsignmentCodes.length > 0) {
          onConsignmentCodeDetected(validConsignmentCodes[validConsignmentCodes.length - 1]);
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      toast({
        variant: 'destructive',
        title: "Paste failed",
        description: "Could not read clipboard contents. Please grant permission.",
      });
    }
  };

  const currentGridHeight = gridColumns === 1 ? 86 : gridHeight;
  const teamWorkGridColumns = 4; // Hardcode to 4 for Team Work mode

  const displayStats = statistics || { levelIJ: 0, levelKL: 0, levelC: 0, groundFloor: 0 };
    
  return (
    <Card className="relative overflow-visible" ref={containerCardRef}>
      <CardHeader className="flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Boxes className="w-7 h-7" />
            Container
        </CardTitle>
        <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex items-center space-x-2">
              <Switch
                  id="paste-on-click"
                  checked={pasteOnFocus}
                  onCheckedChange={setPasteOnFocus}
              />
              <Label htmlFor="paste-on-click">Paste on click</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="focus-mode"
                    checked={isFocusMode}
                    onCheckedChange={setIsFocusMode}
                    disabled={barcodes.length === 0}
                />
                <Label htmlFor="focus-mode">Focus Mode</Label>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-28 justify-between">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Cols: {gridColumns}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {PREDEFINED_COLUMNS.map((cols) => (
                  <DropdownMenuItem
                    key={cols}
                    onSelect={() => setGridColumns(cols)}
                  >
                    {cols}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className={cn(
            "grid gap-6 items-start",
            isTeamWorkActive ? "grid-cols-10" : "grid-cols-2"
        )}>
          <div className={cn(
              "col-span-3",
              !isTeamWorkActive && "hidden"
          )}>
            <ConsignmentSwitcher 
              allBarcodes={allConsignmentBarcodes}
              activeBarcode={activeConsignmentBarcode}
              setActiveBarcode={setActiveConsignmentBarcode}
              inContainer={true}
            />
          </div>

          <div className={cn(
            "flex flex-col gap-4",
            isTeamWorkActive ? "col-span-4" : "col-span-1"
          )}>
            <Textarea
              ref={textareaRef}
              placeholder="Paste your list of codes here..."
              className="w-full resize-none h-full"
              rows={5}
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleTextareaClick}
              onPaste={handleInputChange}
            />
            {!isTeamWorkActive && activeConsignmentCodeValue && (
                <div className="mt-4 flex items-center gap-3 text-foreground">
                    <ListChecks className="w-6 h-6" />
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold">Consignment:</span>
                        <span className="text-lg font-semibold font-code">{activeConsignmentCodeValue}</span>
                    </div>
                </div>
            )}
          </div>
          
          <Card className={cn(isTeamWorkActive ? "col-span-3" : "col-span-1")}>
            <CardHeader className="p-4 flex flex-row items-center justify-between">
                <div className='flex items-center gap-2'>
                  <BarChart2 className="w-5 h-5" />
                  <CardTitle className="text-lg">
                    Statistics
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">Total: {barcodes.length}</span>
                  <Button variant="ghost" size="icon" onClick={handlePrintStats} title="Print statistics" disabled={!statistics}>
                      <Printer className="w-4 h-4" />
                      <span className="sr-only">Print statistics</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleOpenStatsPage} title="Open statistics in new tab" disabled={!statistics}>
                      <ExternalLink className="w-4 h-4" />
                      <span className="sr-only">Open statistics in new tab</span>
                  </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">I & J</span>
                  <span className="font-semibold text-base">{displayStats.levelIJ}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Level C</span>
                  <span className="font-semibold text-base">{displayStats.levelC}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">K & L</span>
                  <span className="font-semibold text-base">{displayStats.levelKL}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ground Floor</span>
                  <span className="font-semibold text-base">{displayStats.groundFloor}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6" ref={gridContainerRef}>
          {barcodes.length > 0 ? (
             isTeamWorkActive ? (
                <div className="flex justify-between gap-8">
                  <div className="w-[48%]">
                    <h3 className="text-lg font-semibold text-center mb-4">Part 1 ({leftBarcodes.length} items)</h3>
                    <div
                      ref={leftScrollContainerRef}
                      className="grid-scroll-container pr-2"
                    >
                      <div 
                        className="grid gap-4"
                        style={{ gridTemplateColumns: `repeat(${teamWorkGridColumns}, minmax(0, 1fr))` }}
                      >
                        {leftBarcodes.map((value, index) => {
                          const rowIndex = Math.floor(index / teamWorkGridColumns);
                          const focusChunkIndex = Math.floor(rowIndex / focusModeVisibleRows);
                          const isBlurred = isFocusMode && focusChunkIndex !== focusedRowLeft;
                          return (
                            <GridBarcode
                              ref={el => { leftRowRefs.current[index] = el; }}
                              key={`${value}-${index}`}
                              value={value}
                              index={index}
                              height={currentGridHeight}
                              isBlurred={isBlurred}
                              isOneColumn={false}
                              onClick={() => isFocusMode && setFocusedRowLeft(focusChunkIndex)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="w-[48%]">
                    <h3 className="text-lg font-semibold text-center mb-4">Part 2 ({rightBarcodes.length} items)</h3>
                    <div
                      ref={rightScrollContainerRef}
                      className="grid-scroll-container pr-2"
                    >
                      <div
                        className="grid gap-4"
                        style={{ gridTemplateColumns: `repeat(${teamWorkGridColumns}, minmax(0, 1fr))` }}
                      >
                        {rightBarcodes.map((value, index) => {
                          const originalIndex = index + midPoint;
                          const rowIndex = Math.floor(index / teamWorkGridColumns);
                          const focusChunkIndex = Math.floor(rowIndex / focusModeVisibleRows);
                          const isBlurred = isFocusMode && focusChunkIndex !== focusedRowRight;
                          return (
                            <GridBarcode
                              ref={el => { rightRowRefs.current[index] = el; }}
                              key={`${value}-${originalIndex}`}
                              value={value}
                              index={originalIndex}
                              height={currentGridHeight}
                              isBlurred={isBlurred}
                              isOneColumn={false}
                              onClick={() => isFocusMode && setFocusedRowRight(focusChunkIndex)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
                >
                  {barcodes.map((value, index) => {
                    const rowIndex = Math.floor(index / gridColumns);
                    const focusChunkIndex = Math.floor(rowIndex / focusModeVisibleRows);
                    const isBlurred = isFocusMode && focusChunkIndex !== focusedRow;
                    const isOneColumn = gridColumns === 1;

                    return (
                      <GridBarcode
                        ref={el => {
                          if (rowRefs.current) {
                            rowRefs.current[index] = el;
                          }
                        }}
                        key={`${value}-${index}`} 
                        value={value} 
                        index={index}
                        height={currentGridHeight}
                        isBlurred={isBlurred}
                        onClick={() => isFocusMode && setFocusedRow(focusChunkIndex)}
                        isOneColumn={isOneColumn}
                      />
                    );
                  })}
                </div>
              )
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>Your grid of barcodes will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
