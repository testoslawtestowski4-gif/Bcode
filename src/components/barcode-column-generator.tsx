'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { ListChecks, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

export interface BarcodeData {
  id: string;
  value: string;
}

interface BarcodeColumnGeneratorProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  // Lifted state
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  allBarcodes: BarcodeData[];
  setAllBarcodes: Dispatch<SetStateAction<BarcodeData[]>>;
  activeBarcode: string | null;
  setActiveBarcode: Dispatch<SetStateAction<string | null>>;
}

// Validation helper
export const isValidBarcode = (code: string) => {
  // Must start with one or more letters, followed by 3 to 5 digits, and nothing else.
  // Must not start with 'web' (case-insensitive).
  return /^[a-zA-Z]+\d{3,5}$/.test(code) && !/^web/i.test(code);
};

export function BarcodeColumnGenerator({ 
  isCollapsed, setIsCollapsed,
  inputValue, setInputValue, allBarcodes, setAllBarcodes,
  activeBarcode, setActiveBarcode
}: BarcodeColumnGeneratorProps) {
  const { columnHeight, pasteOnFocus } = useSettings();
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]); // This is the displayed list
  const [filterPrefixes, setFilterPrefixes] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const debouncedValue = useDebounce(inputValue, 500);
  const { toast } = useToast();

  // Print settings state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printFontSize, setPrintFontSize] = useState(140);
  const [printFontWeight, setPrintFontWeight] = useState(true);
  const [printOrientation, setPrintOrientation] = useState<'landscape' | 'portrait'>('landscape');

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
    setIsCollapsed(false);
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
                        @media print {
                            @page { size: ${printOrientation}; margin: 0mm; }
                            body {
                                display: flex;
                                flex-direction: column;
                                margin: 0;
                                font-family: sans-serif;
                            }
                            .printable-content {
                                page-break-after: always;
                                font-size: ${printFontSize}pt;
                                font-weight: ${printFontWeight ? 'bold' : 'normal'};
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
                            height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
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
        setIsPrintDialogOpen(false);
    }
  };

  return (
      <Card className="relative overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <ListChecks className="w-7 h-7" />
              Consignment
          </CardTitle>
          <AlertDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline"
                    size="icon"
                    disabled={barcodes.length === 0}
                    title="Print All"
                >
                    <Printer className="w-4 h-4" />
                    <span className="sr-only">Print All</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Print Settings</AlertDialogTitle>
                    <AlertDialogDescription>
                        Adjust the settings for your printed output.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <Label htmlFor="font-size-slider">Font Size: {printFontSize}pt</Label>
                        <Slider
                            id="font-size-slider"
                            min={20}
                            max={300}
                            step={10}
                            value={[printFontSize]}
                            onValueChange={(value) => setPrintFontSize(value[0])}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="font-weight-switch"
                            checked={printFontWeight}
                            onCheckedChange={setPrintFontWeight}
                        />
                        <Label htmlFor="font-weight-switch">Bold Text</Label>
                    </div>
                    <div className="space-y-2">
                        <Label>Page Orientation</Label>
                        <RadioGroup
                            value={printOrientation}
                            onValueChange={(value: 'landscape' | 'portrait') => setPrintOrientation(value)}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="landscape" id="orientation-landscape" />
                                <Label htmlFor="orientation-landscape">Landscape</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="portrait" id="orientation-portrait" />
                                <Label htmlFor="orientation-portrait">Portrait</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePrint}>Print</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
