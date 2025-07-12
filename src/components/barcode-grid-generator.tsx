'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes, BarChart2, ArrowDownToLine } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function BarcodeGridGenerator() {
  const { gridWidth, gridHeight, gridMargin, gridColumns, setGridColumns } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 3, 5, 7];

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const parseBarcodes = (input: string) => {
    if (!input) {
      return [];
    }
  
    // 1. Find all purely numeric sequences in the entire input.
    const allNumbers = input.match(/\d+/g) || [];
  
    // 2. Find numbers that are associated with "web-dropoff" to exclude them.
    // This regex finds "web-dropoff" and captures a number on the same line or the next line.
    const webDropoffRegex = /web-dropoff[^\n]*?(\d+)|(\d+)[^\n]*?web-dropoff|web-dropoff\s*\n\s*(\d+)/gi;
    const excludedNumbers = new Set<string>();
    let match;
    while ((match = webDropoffRegex.exec(input)) !== null) {
      // The captured number can be in group 1, 2 or 3
      const num = match[1] || match[2] || match[3];
      if (num) {
        excludedNumbers.add(num.trim());
      }
    }
  
    // 3. Filter out the excluded numbers and get unique values.
    const uniqueValidNumbers = new Set<string>();
    for (const num of allNumbers) {
      if (!excludedNumbers.has(num)) {
        uniqueValidNumbers.add(num);
      }
    }
    
    return Array.from(uniqueValidNumbers);
  };

  const barcodes = parseBarcodes(debouncedValue);

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


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };

  const handleScrollToGrid = () => {
    gridContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
    
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Total Barcodes:</span>
                  <span className="font-semibold">{barcodes.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Level I&J:</span>
                  <span className="font-semibold">0</span>
                </li>
                <li className="flex justify-between">
                  <span>Level K&M:</span>
                  <span className="font-semibold">0</span>
                </li>
                 <li className="flex justify-between">
                  <span>Level C:</span>
                  <span className="font-semibold">0</span>
                </li>
                 <li className="flex justify-between">
                  <span>Ground Floor:</span>
                  <span className="font-semibold">0</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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
                    key={`${value}-${index}`} 
                    value={value} 
                    index={index}
                    width={gridWidth}
                    height={gridHeight}
                    margin={gridMargin}
                    isBlurred={isBlurred}
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
