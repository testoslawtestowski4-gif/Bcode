'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';

export function BarcodeGridGenerator() {
  const { gridRows, gridWidth, gridHeight, gridMargin, gridColumns } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);

  const barcodes = debouncedValue
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };
    
  return (
    <Card>
      <CardContent className="p-6">
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
