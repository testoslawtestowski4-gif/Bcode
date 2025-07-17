'use client';

import { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableBarcodeProps {
  onClose: () => void;
}

export function DraggableBarcode({ onClose }: DraggableBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const value = 'inship01';

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: true,
        fontOptions: 'bold',
        background: '#FFFFFF',
        lineColor: '#000000',
        margin: 10,
        height: 50,
        fontSize: 18,
      });
    }
  }, []);

  return (
    <div
      className="fixed z-20 top-0 left-1/2 -translate-x-1/2"
      style={{
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <Card 
        className="w-80 shadow-2xl bg-white border-2 border-muted rounded-t-none rounded-b-lg"
      >
        <CardHeader 
            className="flex flex-row items-center justify-between p-2"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-xs">Floating Barcode</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setScale(s => Math.max(0.2, s - 0.1))}>
                <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setScale(s => s + 0.1)}>
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-white">
          <svg ref={svgRef} className="w-full h-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
