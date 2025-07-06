'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { ListChecks } from 'lucide-react';

interface BarcodeData {
  id: string;
  value: string;
}

// Validation helper
const isValidBarcode = (line: string) => {
  const trimmed = line.trim();
  if (trimmed.toLowerCase().startsWith('web')) {
    return false;
  }
  // Must start with a letter and contain at least one number.
  return /^[a-zA-Z]/.test(trimmed) && /[0-9]/.test(trimmed);
};

export function BarcodeColumnGenerator() {
  const { columnRows, columnWidth, columnHeight, columnMargin } = useSettings();
  const [inputValue, setInputValue] = useState('');
  
  const [allBarcodes, setAllBarcodes] = useState<BarcodeData[]>([]);
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]); // This is the displayed list

  const [filterPrefixes, setFilterPrefixes] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    const lines = debouncedValue.split('\n').map(line => line.trim()).filter(Boolean);
    const uniqueValidLines = Array.from(new Set(lines.filter(isValidBarcode)));

    const newAllBarcodes = uniqueValidLines.map((line, index) => ({
      id: `${line}-${index}`,
      value: line,
    }));
    setAllBarcodes(newAllBarcodes);

    const prefixes = new Set(
      uniqueValidLines
        .map(line => (line.match(/[a-zA-Z]+/) || [''])[0].toUpperCase())
        .filter(Boolean)
    );
    setFilterPrefixes(Array.from(prefixes).sort());
    
    setActiveFilter('ALL'); // Reset filter on new input
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    let filteredBarcodes: BarcodeData[];
    if (activeFilter === 'ALL') {
      filteredBarcodes = allBarcodes;
    } else {
      filteredBarcodes = allBarcodes.filter(barcode => 
        barcode.value.toUpperCase().startsWith(activeFilter)
      );
    }
    setBarcodes(filteredBarcodes);

    // Reset active barcode when the list changes
    if (filteredBarcodes.length > 0) {
        if (!filteredBarcodes.some(b => b.id === activeBarcode)) {
            setActiveBarcode(filteredBarcodes[0].id);
        }
    } else {
        setActiveBarcode(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, allBarcodes]);


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
            <ListChecks className="w-7 h-7" />
            Consignment View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="relative">
          <Textarea
            placeholder="Paste your list of codes here..."
            className="w-full resize-none"
            rows={columnRows}
            value={inputValue}
            onChange={handleInputChange}
            onPaste={handleInputChange}
          />
        </div>

        {filterPrefixes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={activeFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter('ALL')}
            >
              All
            </Button>
            {filterPrefixes.map(prefix => (
              <Button
                key={prefix}
                variant={activeFilter === prefix ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(prefix)}
              >
                {prefix}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {barcodes.length > 0 ? (
            barcodes.map((item) => (
              <InteractiveBarcode
                key={item.id}
                value={item.value}
                isActive={activeBarcode === item.id || barcodes.length === 1}
                onClick={() => setActiveBarcode(item.id)}
                width={columnWidth}
                height={columnHeight}
                margin={columnMargin}
                isInteractive={barcodes.length > 1}
              />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>Your generated barcodes will appear here.</p>
              <p className="text-xs mt-2">(Codes must start with a letter and contain numbers, e.g., EX1234)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
