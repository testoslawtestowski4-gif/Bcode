'use client';

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/context/settings-context';

export function SettingsSheet() {
  const {
    rows,
    setRows,
    margin,
    setMargin,
    width,
    setWidth,
    height,
    setHeight,
  } = useSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust the barcode generation settings.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="rows">Input Rows: {rows}</Label>
            <Slider
              id="rows"
              min={1}
              max={20}
              step={1}
              value={[rows]}
              onValueChange={(value) => setRows(value[0])}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="width">Barcode Width: {width.toFixed(1)}</Label>
            <Slider
              id="width"
              min={1}
              max={4}
              step={0.1}
              value={[width]}
              onValueChange={(value) => setWidth(value[0])}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="height">Barcode Height: {height}</Label>
            <Slider
              id="height"
              min={20}
              max={150}
              step={5}
              value={[height]}
              onValueChange={(value) => setHeight(value[0])}
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="margin">Barcode Margin: {margin}</Label>
            <Slider
              id="margin"
              min={0}
              max={40}
              step={1}
              value={[margin]}
              onValueChange={(value) => setMargin(value[0])}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
