
'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { ListChecks, Printer } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { useToast } from '@/hooks/use-toast';

export interface BarcodeData {
  id: string;
  value: string;
}

interface BarcodeColumnGeneratorProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  allBarcodes: BarcodeData[];
  setAllBarcodes: Dispatch<SetStateAction<BarcodeData[]>>;
  activeBarcode: string | null;
  setActiveBarcode: Dispatch<SetStateAction<string | null>>;
  setShowSnowfall: (enabled: boolean) => void;
}

// Validation helper
export const isValidBarcode = (code: string) => {
  // Must start with one or more letters, followed by 3 to 5 digits, and nothing else.
  // Must not start with 'web' (case-insensitive).
  // Must not contain 'WEBHANG' (case-insensitive).
  return /^[a-zA-Z]+\d{3,5}$/.test(code) && !/^web/i.test(code) && !/webhang/i.test(code);
};

export function BarcodeColumnGenerator({ 
  inputValue, setInputValue, allBarcodes, setAllBarcodes,
  activeBarcode, setActiveBarcode, setShowSnowfall
}: BarcodeColumnGeneratorProps) {
  const { 
    columnHeight, pasteOnFocus, printFontSize, 
    printFontWeight, printOrientation
  } = useSettings();
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]); // This is the displayed list
  const [filterPrefixes, setFilterPrefixes] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const debouncedValue = useDebounce(inputValue, 500);
  const { toast } = useToast();

  useEffect(() => {
    // Easter egg check for snowfall
    if (inputValue.toLowerCase().trim() === 'xmass') {
      setShowSnowfall(true);
    }
  }, [inputValue, setShowSnowfall]);

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
  }, [debouncedValue, setAllBarcodes]);

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
  }, [activeFilter, allBarcodes, activeBarcode, setActiveBarcode]);


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
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
          description: `Pasted ${text.length} characters into 'Consignment' field.`,
        });
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

  const handlePrint = () => {
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
                        body { 
                            margin: 0;
                            font-family: sans-serif;
                        }
                        .printable-content {
                            font-size: ${printFontSize}pt;
                            font-weight: ${printFontWeight ? 'bold' : 'normal'};
                            text-align: center;
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-bottom: 2px solid #ccc;
                        }
                        @media print {
                            @page { 
                                size: ${printOrientation}; 
                                margin: 0mm; 
                            }
                            body {
                                display: block;
                            }
                            .printable-content {
                                page-break-after: always;
                                height: 100vh;
                                border-bottom: none;
                            }
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
      <Card className="relative overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <ListChecks className="w-7 h-7" />
              Consignment
          </CardTitle>
          <Button 
              variant="outline"
              size="icon"
              onClick={handlePrint}
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
              rows={5}
              value={inputValue}
              onChange={handleInputChange}
              onPaste={handleInputChange}
              onClick={handleTextareaClick}
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
                  height={columnHeight}
                  isInteractive={barcodes.length > 1}
                  printOptions={{
                    fontSize: printFontSize,
                    fontWeight: printFontWeight,
                    orientation: printOrientation
                  }}
                />
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>Your generated barcodes will appear here.</p>
                <p className="text-xs mt-2">(Codes must be letters followed by 3-5 digits, e.g., MIX12345)</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
  );
}
