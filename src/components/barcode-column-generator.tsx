'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';

interface BarcodeData {
  id: string;
  value: string;
}

export function BarcodeColumnGenerator() {
  const { rows, width, height, margin } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    const lines = debouncedValue.split('\n').filter(line => line.trim() !== '');
    const newBarcodes = lines.map((line, index) => ({
      id: `${line.trim()}-${index}`,
      value: line.trim(),
    }));
    
    setBarcodes(newBarcodes);

    if (!activeBarcode || !newBarcodes.some(b => b.id === activeBarcode)) {
      setActiveBarcode(newBarcodes.length > 0 ? newBarcodes[0].id : null);
    }
  }, [debouncedValue, activeBarcode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <Textarea
            placeholder="Paste your list of numbers here, one per line..."
            className="w-full resize-none"
            rows={rows}
            value={inputValue}
            onChange={handleInputChange}
            onPaste={handleInputChange}
          />
        </div>

        <div className="mt-6 space-y-4">
          {barcodes.length > 0 ? (
            barcodes.map((item) => (
              <InteractiveBarcode
                key={item.id}
                value={item.value}
                isActive={activeBarcode === item.id}
                onClick={() => setActiveBarcode(item.id)}
                width={width}
                height={height}
                margin={margin}
                isInteractive={barcodes.length > 1}
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>Your generated barcodes will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
