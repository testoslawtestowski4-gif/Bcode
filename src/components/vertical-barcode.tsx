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
          lineColor: '#000000',
          margin: 10,
          height: 400, // This becomes the width after rotation, can be large
          width: 6,   // This becomes the stroke width
        });
      } catch (e) {
        console.error('Barcode generation failed', e);
      }
    }
  }, [value]);

  return (
    <div className={cn("h-full w-full flex items-center justify-center", className)}>
        <svg ref={svgRef} className="w-full h-full -rotate-90" preserveAspectRatio="none"/>
    </div>
  );
}
