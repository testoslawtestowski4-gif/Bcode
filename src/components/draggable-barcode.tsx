'use client';

import { useState, useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, X, ZoomIn, ZoomOut } from 'lucide-react';

interface DraggableBarcodeProps {
  onClose: () => void;
}

export function DraggableBarcode({ onClose }: DraggableBarcodeProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
        margin: 20,
        height: 80,
        width: 4,
        fontSize: 24,
      });
    }
  }, []);

  useEffect(() => {
    setPosition({ x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 150 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
        setIsDragging(true);
        setDragStart({
            x: e.clientX / scale - position.x,
            y: e.clientY / scale - position.y,
        });
        document.body.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
        e.preventDefault();
        setPosition({
            x: e.clientX / scale - dragStart.x,
            y: e.clientY / scale - dragStart.y,
        });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart, scale]);


  return (
    <div
      ref={cardRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <Card 
        className="w-96 shadow-2xl bg-white border-2 border-muted"
        onMouseDown={handleMouseDown}
      >
        <CardHeader 
            className="flex flex-row items-center justify-between p-2 bg-muted/50"
        >
          <div className="flex items-center gap-2 cursor-move text-muted-foreground" data-drag-handle>
            <GripVertical className="h-5 w-5" />
            <span className="font-semibold text-xs">Draggable Barcode</span>
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
        <CardContent className="p-8 bg-white">
          <svg ref={svgRef} className="w-full h-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
