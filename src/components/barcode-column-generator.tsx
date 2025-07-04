'use client';

import { useState, useTransition } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveBarcode } from '@/components/interactive-barcode';
import { correctBarcodeFormat } from '@/app/actions';
import { useDebounce } from '@/hooks/use-debounce';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeData {
  id: string;
  original: string;
  corrected: string;
  correction: string;
}

export function BarcodeColumnGenerator() {
  const [inputValue, setInputValue] = useState('');
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [activeBarcode, setActiveBarcode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const debouncedValue = useDebounce(inputValue, 500);
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);

    startTransition(async () => {
      if (!value.trim()) {
        setBarcodes([]);
        return;
      }

      const lines = value.split('\n').filter(line => line.trim() !== '');
      try {
        const promises = lines.map(async (line, index) => {
          const result = await correctBarcodeFormat({ inputString: line.trim() });
          return {
            id: `${line.trim()}-${index}`,
            original: line.trim(),
            corrected: result.correctedString,
            correction: result.correctionsApplied,
          };
        });

        const newBarcodes = await Promise.all(promises);
        setBarcodes(newBarcodes);
        if (newBarcodes.length > 0 && !activeBarcode) {
            setActiveBarcode(newBarcodes[0].id)
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate barcodes. Please try again.",
        })
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <Textarea
            placeholder="Paste your list of numbers here, one per line..."
            className="w-full resize-none"
            rows={5}
            value={inputValue}
            onChange={handleInputChange}
            onPaste={handleInputChange}
          />
          {isPending && (
            <div className="absolute bottom-2 right-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {barcodes.length > 0 ? (
            barcodes.map((item) => (
              <InteractiveBarcode
                key={item.id}
                value={item.corrected}
                originalValue={item.original}
                correction={item.correction}
                isActive={activeBarcode === item.id}
                onClick={() => setActiveBarcode(item.id)}
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
