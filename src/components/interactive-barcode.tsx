
'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

interface PrintOptions {
  fontSize: number;
  fontWeight: boolean;
  orientation: 'landscape' | 'portrait';
}

interface InteractiveBarcodeProps {
  value: string;
  isActive: boolean;
  onClick: () => void;
  height: number;
  isInteractive?: boolean;
  printOptions?: PrintOptions;
}

const defaultPrintOptions: PrintOptions = {
  fontSize: 140,
  fontWeight: true,
  orientation: 'landscape',
};

export function InteractiveBarcode({
  value,
  isActive,
  onClick,
  height = 40,
  isInteractive = true,
  printOptions = defaultPrintOptions,
}: InteractiveBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: false,
          background: 'transparent',
          lineColor: '#000000',
          height: height,
        });
      } catch (e) {
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value, height]);

  const showActiveState = !isInteractive || isActive;

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                @page { size: ${printOptions.orientation}; margin: 0mm; }
                body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  font-family: sans-serif;
                }
                .printable-content {
                  font-size: ${printOptions.fontSize}pt;
                  font-weight: ${printOptions.fontWeight ? 'bold' : 'normal'};
                  text-align: center;
                }
              }
              body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  font-family: sans-serif;
              }
              .printable-content {
                  font-size: ${printOptions.fontSize}pt;
                  font-weight: ${printOptions.fontWeight ? 'bold' : 'normal'};
                  text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="printable-content">${value}</div>
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
    <Card
      onClick={isInteractive ? onClick : undefined}
      className={cn(
        'barcode-card',
        'overflow-hidden relative flex items-stretch',
        isInteractive && 'cursor-pointer transition-all',
        showActiveState 
          ? 'border-primary shadow-lg dark:border-primary/80 dark:shadow-[0_0_15px_hsl(var(--primary))]' 
          : (isInteractive ? 'hover:border-primary/50' : '')
      )}
    >
      <div className="relative flex-grow">
        <div
          className={cn(
            'h-full flex flex-col',
            showActiveState ? 'opacity-100' : 'opacity-0'
          )}
        >
          <CardContent className="p-4 pt-4 flex-grow flex items-center">
            <svg ref={svgRef} className="w-full" />
          </CardContent>
          <CardFooter className="flex flex-col items-center p-2 pt-0">
            <p className="text-center font-code text-xl text-card-foreground">
                {value}
            </p>
          </CardFooter>
        </div>
        {!showActiveState && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="text-4xl font-bold text-center break-all font-code text-card-foreground">
              {value}
            </span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={handlePrint}
        className="h-auto w-20 rounded-none border-l text-muted-foreground hover:bg-primary/10 hover:text-primary flex-shrink-0"
        aria-label={`Print barcode value ${value}`}
      >
        <Printer className="h-8 w-8" />
      </Button>
    </Card>
  );
}
