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
import { Separator } from './ui/separator';

export function SettingsSheet() {
  const {
    columnRows, setColumnRows, columnHeight, setColumnHeight,
    gridHeight, setGridHeight
  } = useSettings();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust the barcode generation settings.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-8">
            <div>
                <h4 className="text-lg font-medium mb-4">Column View</h4>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="column-rows">Input Rows: {columnRows}</Label>
                        <Slider id="column-rows" min={1} max={20} step={1} value={[columnRows]} onValueChange={(value) => setColumnRows(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="column-height">Barcode Height: {columnHeight}</Label>
                        <Slider id="column-height" min={20} max={150} step={5} value={[columnHeight]} onValueChange={(value) => setColumnHeight(value[0])} />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Grid View</h4>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-height">Barcode Height: {gridHeight}</Label>
                        <Slider id="grid-height" min={10} max={100} step={5} value={[gridHeight]} onValueChange={(value) => setGridHeight(value[0])} />
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
