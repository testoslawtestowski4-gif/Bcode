'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface VerticalBarcodeProps {
  value: string;
  className?: string;
}

export function VerticalBarcode({ value, className }: VerticalBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: true,
          fontOptions: 'bold',
          textAlign: 'center',
          textPosition: 'bottom',
          fontSize: 20,
          background: 'transparent',
          lineColor: 'hsl(var(--primary))',
          margin: 10,
          height: 400, // Tall
          width: 1,  // Thin
        });
      } catch (e) {
        console.error('Barcode generation failed', e);
      }
    }
  }, [value]);

  return (
    <div className={cn("h-full flex items-center justify-center -rotate-90", className)}>
        <svg ref={svgRef} className="w-[450px] h-[150px]"/>
    </div>
  );
}
