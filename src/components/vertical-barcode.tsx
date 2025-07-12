'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';

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
          lineColor: '#000000', // Black color
          margin: 10,
          height: 800, // Very tall
          width: 1.5,
        });
      } catch (e) {
        console.error('Barcode generation failed', e);
      }
    }
  }, [value]);

  return (
    <div className={cn("h-full w-full flex items-center justify-center -rotate-90", className)}>
        <svg ref={svgRef} className="w-[90vh] max-w-none h-[250px]"/>
    </div>
  );
}
