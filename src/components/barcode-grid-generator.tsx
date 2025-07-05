'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';

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

      // Handle multi-column paste with 'inship01'
      if (trimmedLine.toLowerCase().includes('inship01')) {
        const parts = trimmedLine.split(/\s+/);
        const inshipIndex = parts.findIndex(part => part.toLowerCase() === 'inship01');
        if (inshipIndex > 0) {
          return parts[inshipIndex - 1]; // Return the part before 'inship01'
        }
        return null; // 'inship01' is the first word or not found as a separate word
      }
      
      // Handle simple, single-column paste. It must not contain spaces and must contain at least one number.
      if (!trimmedLine.includes(' ')) {
        const hasNumbers = /[0-9]/.test(trimmedLine);
        if (hasNumbers) {
            return trimmedLine;
        }
      }
      
      // Ignore all other formats (e.g., multi-word lines without 'inship01', or text-only single words)
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
        <CardTitle className="text-2xl font-semibold">Container View</CardTitle>
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
          placeholder="Paste another list of numbers here..."
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
