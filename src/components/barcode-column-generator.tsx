'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { ListChecks, Printer } from 'lucide-react';

interface BarcodeData {
  id: string;
  value: string;
}

// Validation helper
const isValidBarcode = (code: string) => {
  // Must be composed of only letters and numbers
  if (!/^[a-zA-Z0-9]+$/.test(code)) {
    return false;
  }
  // Must contain at least one letter and at least one number
  if (!(/[a-zA-Z]/.test(code) && /[0-9]/.test(code))) {
    return false;
  }
  // Must not contain "web" (case-insensitive)
  if (code.toLowerCase().includes('web')) {
    return false;
  }
  // Must have more than 3 digits
  if ((code.match(/\d/g) || []).length <= 3) {
    return false;
  }
  return true;
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
    // Find all alphanumeric sequences in the input text
    const potentialCodes = debouncedValue.match(/[a-zA-Z0-9]+/g) || [];
    
    // Filter them based on validation rules and ensure uniqueness
    const uniqueValidCodes = Array.from(new Set(potentialCodes.filter(isValidBarcode)));

    const newAllBarcodes = uniqueValidCodes.map((code, index) => ({
      id: `${code}-${index}`,
      value: code,
    }));
    setAllBarcodes(newAllBarcodes);

    const prefixes = new Set(
      uniqueValidCodes
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

  const handlePrintAll = () => {
    if (barcodes.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        const barcodeHtml = barcodes.map(barcode => 
            `<div class="printable-content">${barcode.value}</div>`
        ).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print All Barcodes</title>
                    <style>
                        @media print {
                            @page { size: auto; margin: 0mm; }
                            body { margin: 0; font-family: sans-serif; }
                            .printable-content {
                                page-break-after: always;
                                font-size: 140pt;
                                font-weight: bold;
                                text-align: center;
                                height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .printable-content:last-child {
                                page-break-after: auto;
                            }
                        }
                        body { font-family: sans-serif; }
                        .printable-content {
                            font-size: 40pt;
                            font-weight: bold;
                            text-align: center;
                            padding: 40px 0;
                            border-bottom: 2px solid #ccc;
                        }
                    </style>
                </head>
                <body>
                    ${barcodeHtml}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ListChecks className="w-7 h-7" />
            Consignment View
        </CardTitle>
        <Button 
            variant="outline"
            size="icon"
            onClick={handlePrintAll} 
            disabled={barcodes.length === 0}
            title="Print All"
        >
            <Printer className="w-4 h-4" />
            <span className="sr-only">Print All</span>
        </Button>
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
              <p className="text-xs mt-2">(Codes must be alphanumeric, e.g., EX12345)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
