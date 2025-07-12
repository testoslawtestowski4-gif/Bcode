'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GridBarcode } from '@/components/grid-barcode';
import { useDebounce } from '@/hooks/use-debounce';
import { useSettings } from '@/context/settings-context';
import { Button } from './ui/button';
import { Boxes, BarChart2, ArrowDownToLine, ExternalLink } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { format } from 'date-fns';

interface ParsedBarcode {
  value: string;
  context: string;
}

export function BarcodeGridGenerator() {
  const { gridWidth, gridHeight, gridMargin, gridColumns, setGridColumns } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);
  const PREDEFINED_COLUMNS = [1, 3, 5, 7];

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const parsedBarcodes = useMemo(() => {
    if (!debouncedValue) {
      return [];
    }

    const hasWebDropoff = /web-dropoff/i.test(debouncedValue);
    const matches = new Map<string, ParsedBarcode>();

    if (hasWebDropoff) {
      // Mode 1: Parse from "web-dropoff" context
      const regex = /(\d{7}).*?((?:\d-\w\d-|\w+-)?web-dropoff)/gi;
      let match;
      while ((match = regex.exec(debouncedValue)) !== null) {
        const value = match[1];
        const context = match[2].toLowerCase();
        if (!matches.has(value)) {
          matches.set(value, { value, context });
        }
      }
    } else {
      // Mode 2: Parse standalone 7-digit numbers
      const regex = /\b(\d{7})\b/g;
      let match;
      while ((match = regex.exec(debouncedValue)) !== null) {
        const value = match[1];
        if (!matches.has(value)) {
          matches.set(value, { value, context: 'direct' });
        }
      }
    }
    
    return Array.from(matches.values());
  }, [debouncedValue]);

  const barcodes = useMemo(() => parsedBarcodes.map(b => b.value), [parsedBarcodes]);

  const levelINPatterns = ['2-b1-web-dropoff', '2-b2-web-dropoff', '2-b3-web-dropoff'];
  const levelKMPatterns = ['2-c1-web-dropoff', '2-c2-web-dropoff', '2-c3-web-dropoff'];
  const levelCPatterns = ['1-c1-web-dropoff', '1-c2-web-dropoff', '1-c3-web-dropoff', '1-c4-web-dropoff'];
  const groundFloorPatterns = ['apr-web-dropoff', 'web-dropoff'];

  const getBarcodeLevel = (context: string) => {
    if (levelINPatterns.includes(context)) return 'I&J';
    if (levelKMPatterns.includes(context)) return 'K&L';
    if (levelCPatterns.includes(context)) return 'Level C';
    if (groundFloorPatterns.includes(context)) return 'Ground Floor';
    return 'Unknown';
  };
  
  const statistics = useMemo(() => {
    if (parsedBarcodes.some(b => b.context === 'direct') || parsedBarcodes.length === 0) {
      return null;
    }

    const stats = {
      levelIJ: 0,
      levelKL: 0,
      levelC: 0,
      groundFloor: 0,
    };

    for (const barcode of parsedBarcodes) {
        const level = getBarcodeLevel(barcode.context);
        if (level === 'I&J') stats.levelIJ++;
        else if (level === 'K&L') stats.levelKL++;
        else if (level === 'Level C') stats.levelC++;
        else if (level === 'Ground Floor') stats.groundFloor++;
    }

    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedBarcodes]);

  const handleOpenStatsPage = () => {
    if (!statistics) return;
  
    const generationTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
    const barcodeDetails = parsedBarcodes.map(barcode => `
      <tr>
        <td>${barcode.value}</td>
        <td>${barcode.context}</td>
        <td>${getBarcodeLevel(barcode.context)}</td>
      </tr>
    `).join('');
  
    const statsHtml = `
      <html>
        <head>
          <title>Barcode Statistics</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background-color: #f7f7f7; }
            .container { max-width: 800px; margin: auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            tr:hover { background-color: #f5f5f5; }
            .summary { background-color: #eef; padding: 1rem; border-radius: 4px; margin-bottom: 2rem; }
            .summary p { margin: 0.5rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Barcode Generation Report</h1>
            <div class="summary">
              <p><strong>Generation Time:</strong> ${generationTime}</p>
              <p><strong>Total Containers:</strong> ${barcodes.length}</p>
            </div>
            <h2>Level Breakdown</h2>
            <ul>
              <li><strong>Level I&J:</strong> ${statistics.levelIJ}</li>
              <li><strong>Level K&L:</strong> ${statistics.levelKL}</li>
              <li><strong>Level C:</strong> ${statistics.levelC}</li>
              <li><strong>Ground Floor:</strong> ${statistics.groundFloor}</li>
            </ul>
            <h2>Barcode Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Web Dropoff Location</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                ${barcodeDetails}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(statsHtml);
      printWindow.document.close();
    }
  };


  useEffect(() => {
    if (barcodes.length > 15) {
      setIsFocusMode(true);
    } else {
      setIsFocusMode(false);
    }
    setFocusedRow(0);
  }, [barcodes.length]);

  useEffect(() => {
    if (!isFocusMode || barcodes.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        const totalRows = Math.ceil(barcodes.length / gridColumns);
        if (totalRows > 0) {
          setFocusedRow(prevRow => (prevRow + 1) % totalRows);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode, barcodes.length, gridColumns]);

  useEffect(() => {
    if (isFocusMode) {
      const firstIndexOfRow = focusedRow * gridColumns;
      const rowElement = rowRefs.current[firstIndexOfRow];
      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [focusedRow, isFocusMode, gridColumns]);


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement> | React.ClipboardEvent<HTMLTextAreaElement>) => {
    const value = 'target' in event ? event.target.value : event.clipboardData.getData('text');
    setInputValue(value);
  };

  const handleScrollToGrid = () => {
    gridContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentGridWidth = gridColumns === 1 ? 1.5 : gridWidth;
  const currentGridHeight = gridColumns === 1 ? 40 : gridHeight;
  const currentGridMargin = gridColumns === 1 ? 5 : gridMargin;
    
  return (
    <Card>
      <CardHeader className="flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Boxes className="w-7 h-7" />
            Container View
        </CardTitle>
        <div className="flex items-center gap-4 flex-wrap justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleScrollToGrid}
              disabled={barcodes.length === 0}
              title="Scroll to grid"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span className="sr-only">Scroll to grid</span>
            </Button>
            <div className="flex items-center space-x-2">
                <Switch
                    id="focus-mode"
                    checked={isFocusMode}
                    onCheckedChange={setIsFocusMode}
                    disabled={barcodes.length === 0}
                />
                <Label htmlFor="focus-mode">Focus Mode</Label>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:inline">Columns:</span>
                {PREDEFINED_COLUMNS.map((cols) => (
                  <Button
                    key={cols}
                    variant={gridColumns === cols ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGridColumns(cols)}
                    className="px-4"
                  >
                    {cols}
                  </Button>
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className={`grid grid-cols-1 ${statistics ? 'sm:grid-cols-2' : ''} gap-6`}>
          <div className="relative">
            <Textarea
              placeholder="Paste your list of codes here..."
              className="w-full resize-none"
              rows={5}
              value={inputValue}
              onChange={handleInputChange}
              onPaste={handleInputChange}
            />
          </div>
          {statistics && (
            <Card>
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="w-5 h-5" />
                    Statistics
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleOpenStatsPage} title="Open statistics in new tab">
                      <ExternalLink className="w-4 h-4" />
                      <span className="sr-only">Open statistics in new tab</span>
                  </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm">
                <div className="flex flex-col gap-2 text-center mb-4">
                  <span className="text-muted-foreground">Total Containers</span>
                  <span className="text-3xl font-bold">{barcodes.length}</span>
                </div>
                <Separator className="my-4" />
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">I&amp;J:</span>
                    <span className="font-semibold">{statistics.levelIJ}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">K&amp;L:</span>
                    <span className="font-semibold">{statistics.levelKL}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Level C:</span>
                    <span className="font-semibold">{statistics.levelC}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Ground Floor:</span>
                    <span className="font-semibold">{statistics.groundFloor}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6" ref={gridContainerRef}>
          {barcodes.length > 0 ? (
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
            >
              {barcodes.map((value, index) => {
                const rowIndex = Math.floor(index / gridColumns);
                const isBlurred = isFocusMode && rowIndex !== focusedRow;
                return (
                  <GridBarcode
                    ref={el => {
                      if (rowRefs.current) {
                        rowRefs.current[index] = el;
                      }
                    }}
                    key={`${value}-${index}`} 
                    value={value} 
                    index={index}
                    width={currentGridWidth}
                    height={currentGridHeight}
                    margin={currentGridMargin}
                    isBlurred={isBlurred}
                    onClick={() => isFocusMode && setFocusedRow(rowIndex)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>Your grid of barcodes will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
