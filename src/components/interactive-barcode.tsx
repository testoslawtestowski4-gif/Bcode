'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InteractiveBarcodeProps {
  value: string;
  originalValue: string;
  correction: string;
  isActive: boolean;
  onClick: () => void;
}

export function InteractiveBarcode({
  value,
  originalValue,
  correction,
  isActive,
  onClick,
}: InteractiveBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hasCorrection = correction && correction !== 'No changes needed';

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: false,
          background: 'transparent',
          lineColor: 'hsl(var(--foreground))',
          margin: 0,
          height: 80,
          width: 2,
        });
      } catch (e) {
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value, isActive]);

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 overflow-hidden',
        isActive ? 'border-primary shadow-lg' : 'hover:border-primary/50'
      )}
    >
      <CardContent className="p-4 relative">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            !isActive && 'blur-md'
          )}
        >
          <svg ref={svgRef} className="w-full" />
        </div>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-card/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out',
            isActive ? 'opacity-0' : 'opacity-100'
          )}
        >
          <span className="text-2xl font-bold text-foreground truncate px-2">
            {originalValue || '...'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center p-2 pt-0">
        <p className={cn(
            'text-center font-code text-sm text-muted-foreground transition-opacity duration-300',
            isActive ? 'opacity-100' : 'opacity-0 h-0'
        )}>
            {value}
        </p>
        {hasCorrection && (
           <p className={cn(
            'mt-1 text-center text-xs text-amber-600 flex items-center gap-1 transition-opacity duration-300',
            isActive ? 'opacity-100' : 'opacity-0 h-0'
            )}>
             <AlertCircle className="w-3 h-3"/> {correction}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
