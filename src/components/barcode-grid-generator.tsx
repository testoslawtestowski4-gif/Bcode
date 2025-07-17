'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes, BarChart2, ArrowDownToLine, ExternalLink } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { format } from 'date-fns';

interface ParsedBarcode {
  value: string;
  context: string;
}

const funnyWords = ["BANANA", "POTATO", "GIGGLES", "WOBBLE", "SNICKERDOODLE", "BUMBLEBEE", "FLIBBERTIGIBBET", "SPOON", "NOODLE", "ZEBRA"];
const getRandomFunnyWord = () => funnyWords[Math.floor(Math.random() * funnyWords.length)];

export function BarcodeGridGenerator() {
  const { gridHeight, gridMargin, gridColumns, setGridColumns, isFunnyMode, animationsEnabled } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 4, 6];

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isSpeedMode = !animationsEnabled;

  const parsedBarcodes = useMemo(() => {
    if (isFunnyMode) {
      return Array.from({ length: 50 }, (_, i) => ({
        value: `${getRandomFunnyWord()}${i}`,
        context: 'funny',
      }));
    }

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
  }, [debouncedValue, isFunnyMode]);

  const barcodes = useMemo(() => parsedBarcodes.map(b => b.value), [parsedBarcodes]);

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
    const shouldCalculate = !parsedBarcodes.some(b => b.context === 'direct') && !isFunnyMode;
    
    if (!shouldCalculate) {
      return null;
    }

    const stats = {
      levelIJ: 0,
      levelKL: 0,
      levelC: 0,
      groundFloor: 0,
    };

    for (const barcode of parsedBarcodes) {
        const level = getBarcodeLevel(barcode.context);
        if (level === 'I&J') stats.levelIJ++;
        else if (level === 'K&L') stats.levelKL++;
        else if (level === 'Level C') stats.levelC++;
        else if (level === 'Ground Floor') stats.groundFloor++;
    }

    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedBarcodes, isFunnyMode]);

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
  
    const statsHtml = `
      <html>
        <head>
          <title>Barcode Statistics</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f8f9fa; color: #212529; }
            .container { max-width: 900px; margin: auto; background: white; padding: 2.5rem; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e9ecef; padding-bottom: 1.5rem; margin-bottom: 2rem; }
            h1 { color: #343a40; margin: 0; font-size: 2rem; }
            h2 { color: #495057; border-bottom: 1px solid #dee2e6; padding-bottom: 0.5rem; margin-top: 2.5rem; margin-bottom: 1.5rem; }
            h3 { color: #495057; margin: 0; font-size: 1.2rem; }
            .time-info { text-align: right; }
            .time-info .date { font-size: 1rem; color: #6c757d; }
            .time-info .time { font-size: 2.5rem; font-weight: bold; color: #343a40; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 0.8rem 1rem; border-bottom: 1px solid #e9ecef; }
            th { background-color: #f8f9fa; font-weight: 600; }
            tbody tr:nth-child(even) { background-color: #f8f9fa; }
            tr:hover { background-color: #f1f3f5; }
            .summary-grid { display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap;}
            .summary-card { background-color: #f0f3f5; padding: 1.5rem; border-radius: 8px; text-align: center; border: 1px solid #e0e5e9; flex-grow: 1; }
            .summary-card.total { background-color: #e3f2fd; border-color: #bbdefb; }
            .summary-card .label { font-size: 1rem; color: #495057; margin-bottom: 0.5rem; display: block; }
            .summary-card .count { font-size: 2.2rem; font-weight: bold; color: #343a40; }
            .summary-card.total .count { font-size: 3rem; color: #1e88e5; }
            .level-breakdown { display: flex; gap: 1rem; justify-content: center; }
            .level-group { 
              margin-bottom: 2rem;
              background-color: white;
              border: 1px solid #dee2e6;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              overflow: hidden;
            }
            .level-header {
              background-color: #f8f9fa;
              padding: 1rem 1.5rem;
              border-bottom: 1px solid #dee2e6;
            }
            .level-group table { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
                <h1>Barcode Generation Report</h1>
                <div class="time-info">
                    <div class="date">${generationDate}</div>
                    <div class="time">${generationTime}</div>
                </div>
            </div>
            
            <h2>Summary</h2>
            <div class="summary-grid">
              <div class="summary-card total">
                <span class="label">Total Containers</span>
                <span class="count">${barcodes.length}</span>
              </div>
            </div>
            
            <div class="summary-grid level-breakdown">
              <div class="summary-card">
                <span class="label">I&J</span>
                <span class="count">${statistics.levelIJ}</span>
              </div>
              <div class="summary-card">
                <span class="label">K&L</span>
                <span class="count">${statistics.levelKL}</span>
              </div>
              <div class="summary-card">
                <span class="label">Level C</span>
                <span class="count">${statistics.levelC}</span>
              </div>
               <div class="summary-card">
                <span class="label">Ground Floor</span>
                <span class="count">${statistics.groundFloor}</span>
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


  useEffect(() => {
    if (barcodes.length > 15) {
      setIsFocusMode(true);
    } else {
      setIsFocusMode(false);
    }
    setFocusedRow(0);
  }, [barcodes.length]);

  useEffect(() => {
    if (!isFocusMode || barcodes.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        const totalRows = Math.ceil(barcodes.length / gridColumns);
        if (totalRows > 0) {
          setFocusedRow(prevRow => (prevRow + 1) % totalRows);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode, barcodes.length, gridColumns]);

  useEffect(() => {
    if (isFocusMode) {
      const firstIndexOfRow = focusedRow * gridColumns;
      const rowElement = rowRefs.current[firstIndexOfRow];
      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [focusedRow, isFocusMode, gridColumns]);


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };

  const handleScrollToGrid = () => {
    gridContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentGridHeight = gridColumns === 1 ? 86 : gridHeight;
  const currentGridMargin = gridColumns === 1 ? 10 : gridMargin;

  const showStats = statistics || isSpeedMode;
  const displayStats = statistics || { levelIJ: 0, levelKL: 0, levelC: 0, groundFloor: 0 };
    
  return (
    <Card>
      <CardHeader className="flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Boxes className="w-7 h-7" />
            Container View
        </CardTitle>
        <div className="flex items-center gap-4 flex-wrap justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollToGrid}
              disabled={barcodes.length === 0}
              title="Scroll to grid"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span className="sr-only">Scroll to grid</span>
            </Button>
            <div className="flex items-center space-x-2">
                <Switch
                    id="focus-mode"
                    checked={isFocusMode}
                    onCheckedChange={setIsFocusMode}
                    disabled={barcodes.length === 0}
                />
                <Label htmlFor="focus-mode">Focus Mode</Label>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Columns:</span>
                {PREDEFINED_COLUMNS.map((cols) => (
                  <Button
                    key={cols}
                    variant={gridColumns === cols ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGridColumns(cols)}
                    className="px-4"
                  >
                    {cols}
                  </Button>
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className={`grid grid-cols-1 ${showStats ? 'sm:grid-cols-2' : ''} gap-6`}>
          <div className="relative">
            <Textarea
              placeholder="Paste your list of codes here..."
              className="w-full resize-none"
              rows={5}
              value={inputValue}
              onChange={handleInputChange}
              onPaste={handleInputChange}
            />
          </div>
          {showStats && (
            <Card>
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <div className='flex items-center gap-2'>
                    <BarChart2 className="w-5 h-5" />
                    <CardTitle className="text-lg">
                      Statistics
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">Total: {barcodes.length}</span>
                    <Button variant="ghost" size="icon" onClick={handleOpenStatsPage} title="Open statistics in new tab" disabled={!statistics}>
                        <ExternalLink className="w-4 h-4" />
                        <span className="sr-only">Open statistics in new tab</span>
                    </Button>
                  </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">I&amp;J:</span>
                    <span className="font-semibold">{displayStats.levelIJ}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">K&amp;L:</span>
                    <span className="font-semibold">{displayStats.levelKL}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level C:</span>
                    <span className="font-semibold">{displayStats.levelC}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ground:</span>
                    <span className="font-semibold">{displayStats.groundFloor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6" ref={gridContainerRef}>
          {barcodes.length > 0 ? (
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
            >
              {barcodes.map((value, index) => {
                const rowIndex = Math.floor(index / gridColumns);
                const isBlurred = isFocusMode && rowIndex !== focusedRow;
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
                    margin={currentGridMargin}
                    isBlurred={isBlurred}
                    onClick={() => isFocusMode && setFocusedRow(rowIndex)}
                    isOneColumn={isOneColumn}
                  />
                );
              })}
            </div>
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
