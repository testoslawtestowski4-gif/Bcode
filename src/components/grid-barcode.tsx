'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface GridBarcodeProps {
  value: string;
  index: number;
}

export function GridBarcode({ value, index }: GridBarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          displayValue: false,
          background: 'transparent',
          lineColor: 'hsl(var(--foreground))',
          margin: 10,
          height: 40,
          width: 1.5,
        });
        setIsValid(true);
      } catch (e) {
        setIsValid(false);
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
        }
      }
    }
  }, [value]);

  return (
    <Card className="flex flex-col items-center justify-between">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-xs font-semibold text-muted-foreground">
          #{index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 w-full aspect-[2/1] flex items-center justify-center">
        {isValid ? (
          <svg ref={svgRef} className="w-full h-full" />
        ) : (
          <div className="flex flex-col items-center text-destructive text-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <p className="text-center font-code text-[10px] text-muted-foreground truncate">{value}</p>
      </CardFooter>
    </Card>
  );
}
