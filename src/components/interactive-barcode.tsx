'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface InteractiveBarcodeProps {
  value: string;
  isActive: boolean;
  onClick: () => void;
  width: number;
  height: number;
  margin: number;
}

export function InteractiveBarcode({
  value,
  isActive,
  onClick,
  width = 2,
  height = 80,
  margin = 10,
}: InteractiveBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: false,
          background: 'transparent',
          lineColor: 'hsl(var(--foreground))',
          margin: margin,
          height: height,
          width: width,
        });
      } catch (e) {
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value, width, height, margin]);

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 overflow-hidden',
        isActive ? 'border-destructive shadow-lg' : 'hover:border-destructive/50'
      )}
    >
      <CardContent className="p-4 relative">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isActive && 'blur-md'
          )}
        >
          <svg ref={svgRef} className="w-full" />
        </div>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
            isActive ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="text-2xl font-bold text-foreground truncate px-2">
            {value || '...'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center p-2 pt-0">
        <p className={cn(
            'text-center font-code text-sm text-muted-foreground transition-opacity duration-300',
            isActive ? 'opacity-0 h-0' : 'opacity-100'
        )}>
            {value}
        </p>
      </CardFooter>
    </Card>
  );
}
