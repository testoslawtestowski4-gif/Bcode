'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GridBarcodeProps {
  value: string;
  index: number;
  height: number;
  margin: number;
  isBlurred?: boolean;
  onClick?: () => void;
  isOneColumn?: boolean;
}

export const GridBarcode = forwardRef<HTMLDivElement, GridBarcodeProps>(
  ({ value, index, height, margin, isBlurred = false, onClick, isOneColumn = false }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
      if (svgRef.current && value) {
        try {
          JsBarcode(svgRef.current, value, {
            format: 'CODE128',
            displayValue: false,
            background: 'transparent',
            lineColor: 'hsl(var(--card-foreground))',
            margin: margin,
            height: height,
          });
          setIsValid(true);
        } catch (e) {
          setIsValid(false);
          if (svgRef.current) {
            svgRef.current.innerHTML = '';
          }
        }
      }
    }, [value, height, margin]);

    return (
      <Card
        ref={ref}
        onClick={onClick}
        className={cn(
          "flex flex-col items-center justify-between barcode-card",
          "transition-all duration-300 ease-in-out",
          isBlurred && "blur-md opacity-40 cursor-pointer",
        )}
      >
        <CardHeader className="p-2 pb-0">
          <CardTitle className="text-xs font-semibold text-card-foreground">
            #{index + 1}
          </CardTitle>
        </CardHeader>
        <CardContent 
          className={cn(
            "p-2 w-full flex items-center justify-center",
            !isOneColumn && "aspect-[2/1]"
          )}
          style={{ minHeight: isOneColumn ? '86px' : undefined }}
        >
          {isValid ? (
            <svg ref={svgRef} className="w-full h-full" />
          ) : (
            <div className="flex flex-col items-center text-destructive text-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-2 pt-0">
          <p className="text-center font-code text-sm text-card-foreground truncate">{value}</p>
        </CardFooter>
      </Card>
    );
  }
);

GridBarcode.displayName = 'GridBarcode';
