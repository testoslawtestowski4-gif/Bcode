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
  isInteractive?: boolean;
}

export function InteractiveBarcode({
  value,
  isActive,
  onClick,
  width = 2,
  height = 80,
  margin = 10,
  isInteractive = true,
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

  const showActiveState = isInteractive && isActive;

  return (
    <Card
      onClick={isInteractive ? onClick : undefined}
      className={cn(
        'transition-all duration-300 overflow-hidden relative',
        isInteractive && 'cursor-pointer',
        showActiveState ? 'border-primary shadow-lg' : (isInteractive ? 'hover:border-primary/50' : '')
      )}
    >
      <div
        className={cn(
          'transition-all duration-300',
          !showActiveState && isInteractive ? 'opacity-40 blur-sm' : 'opacity-100 blur-none'
        )}
      >
        <CardContent className="p-4 pt-4">
          <svg ref={svgRef} className="w-full" />
        </CardContent>
        <CardFooter className="flex flex-col items-center p-2 pt-0">
          <p className="text-center font-code text-sm text-muted-foreground">
              {value}
          </p>
        </CardFooter>
      </div>
      {!showActiveState && isInteractive && (
        <div className="absolute inset-0 flex items-center justify-center p-4 backdrop-blur-[2px]">
          <span className="text-2xl font-bold text-center break-all font-code text-foreground">
            {value}
          </span>
        </div>
      )}
    </Card>
  );
}
