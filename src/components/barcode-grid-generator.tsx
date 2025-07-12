'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes, BarChart2, ArrowDownToLine } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface ParsedBarcode {
  value: string;
  context: string;
}

export function BarcodeGridGenerator() {
  const { gridWidth, gridHeight, gridMargin, gridColumns, setGridColumns } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 3, 5, 7];

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  
  const statistics = useMemo(() => {
    // Only calculate stats if not in direct mode
    if (parsedBarcodes.some(b => b.context === 'direct') || parsedBarcodes.length === 0) {
      return null;
    }

    const stats = {
      levelIN: 0,
      levelKM: 0,
      levelC: 0,
      groundFloor: 0,
    };

    const levelINPatterns = ['2-b1-web-dropoff', '2-b2-web-dropoff', '2-b3-web-dropoff'];
    const levelKMPatterns = ['2-c1-web-dropoff', '2-c2-web-dropoff', '2-c3-web-dropoff'];
    const levelCPatterns = ['1-c1-web-dropoff', '1-c2-web-dropoff', '1-c3-web-dropoff', '1-c4-web-dropoff'];
    const groundFloorPatterns = ['apr-web-dropoff', 'web-dropoff'];

    for (const barcode of parsedBarcodes) {
      if (levelINPatterns.includes(barcode.context)) {
        stats.levelIN++;
      } else if (levelKMPatterns.includes(barcode.context)) {
        stats.levelKM++;
      } else if (levelCPatterns.includes(barcode.context)) {
        stats.levelC++;
      } else if (groundFloorPatterns.includes(barcode.context)) {
        stats.groundFloor++;
      }
    }

    return stats;
  }, [parsedBarcodes]);


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

  const currentGridWidth = gridColumns === 1 ? 1.5 : gridWidth;
  const currentGridHeight = gridColumns === 1 ? 40 : gridHeight;
  const currentGridMargin = gridColumns === 1 ? 5 : gridMargin;
    
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
        <div className={`grid grid-cols-1 ${statistics ? 'sm:grid-cols-2' : ''} gap-6`}>
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
          {statistics && (
            <Card>
              <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="w-5 h-5" />
                    Statistics
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm">
                <div className="flex flex-col gap-2 text-center mb-4">
                  <span className="text-muted-foreground">Total Containers</span>
                  <span className="text-3xl font-bold">{barcodes.length}</span>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Level I&amp;N:</span>
                    <span className="font-semibold">{statistics.levelIN}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Level K&amp;M:</span>
                    <span className="font-semibold">{statistics.levelKM}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Level C:</span>
                    <span className="font-semibold">{statistics.levelC}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Ground Floor:</span>
                    <span className="font-semibold">{statistics.groundFloor}</span>
                  </li>
                </ul>
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
                    width={currentGridWidth}
                    height={currentGridHeight}
                    margin={currentGridMargin}
                    isBlurred={isBlurred}
                    onClick={() => isFocusMode && setFocusedRow(rowIndex)}
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
