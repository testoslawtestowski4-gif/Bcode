'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export function Logo() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const value = 'inship01';

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: true,
          fontOptions: 'bold',
          background: 'transparent',
          lineColor: 'hsl(var(--primary))',
          fontColor: 'hsl(var(--primary))',
          margin: 0,
          height: 40,
          width: 2,
          fontSize: 16,
          textMargin: 0,
        });
      } catch (e) {
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, []);

  return (
    <div className="flex items-center h-10">
      <svg ref={svgRef} />
    </div>
  );
}
