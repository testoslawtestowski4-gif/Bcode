'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes } from 'lucide-react';

export function BarcodeGridGenerator() {
  const { gridRows, gridWidth, gridHeight, gridMargin, gridColumns, setGridColumns } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 3, 5, 7];

  const barcodes = Array.from(new Set(debouncedValue
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return null;

      const lowercasedLine = trimmedLine.toLowerCase();
      const parts = lowercasedLine.split(/\s+/);
      const originalParts = trimmedLine.split(/\s+/);

      const dropoffKeywords = [
        '1-b1-web-dropoff', '2-b2-web-dropoff', '2-b3-web-dropoff',
        '2-c1-web-dropoff', '2-c2-web-dropoff', '2-c3-web-dropoff',
        '1-c1-web-dropoff', '1-c2-web-dropoff', '1-c3-web-dropoff',
        '1-c4-web-dropoff', 'apr-web-dropoff', 'web-dropoff'
      ];

      // First, try to find the keyword pattern
      for (let i = 0; i < parts.length; i++) {
        if (dropoffKeywords.includes(parts[i])) {
          if (i > 0 && /^\d+$/.test(parts[i - 1])) {
            return originalParts[i - 1];
          }
        }
      }
      
      // If no keyword pattern was found, check if the whole line is ONLY a number.
      if (parts.length === 1 && /^\d+$/.test(trimmedLine)) {
          return trimmedLine;
      }

      // Otherwise, this line is invalid.
      return null;
    })
    .filter((value): value is string => value !== null && value !== '')));

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };
    
  return (
    <Card>
      <CardHeader className="flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Boxes className="w-7 h-7" />
            Container View
        </CardTitle>
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
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Textarea
          placeholder="Paste your list of codes here..."
          className="w-full resize-none"
          rows={gridRows}
          value={inputValue}
          onChange={handleInputChange}
          onPaste={handleInputChange}
        />

        <div className="mt-6">
          {barcodes.length > 0 ? (
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
            >
              {barcodes.map((value, index) => (
                <GridBarcode 
                  key={`${value}-${index}`} 
                  value={value} 
                  index={index}
                  width={gridWidth}
                  height={gridHeight}
                  margin={gridMargin}
                />
              ))}
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
