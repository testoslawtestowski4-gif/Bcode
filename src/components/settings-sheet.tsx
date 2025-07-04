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
    columnRows, setColumnRows, columnMargin, setColumnMargin, columnWidth, setColumnWidth, columnHeight, setColumnHeight,
    gridRows, setGridRows, gridColumns, setGridColumns, gridMargin, setGridMargin, gridWidth, setGridWidth, gridHeight, setGridHeight
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
                        <Label htmlFor="column-width">Barcode Width: {columnWidth.toFixed(1)}</Label>
                        <Slider id="column-width" min={1} max={4} step={0.1} value={[columnWidth]} onValueChange={(value) => setColumnWidth(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="column-height">Barcode Height: {columnHeight}</Label>
                        <Slider id="column-height" min={20} max={150} step={5} value={[columnHeight]} onValueChange={(value) => setColumnHeight(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="column-margin">Barcode Margin: {columnMargin}</Label>
                        <Slider id="column-margin" min={0} max={40} step={1} value={[columnMargin]} onValueChange={(value) => setColumnMargin(value[0])} />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Grid View</h4>
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-rows">Input Rows: {gridRows}</Label>
                        <Slider id="grid-rows" min={1} max={20} step={1} value={[gridRows]} onValueChange={(value) => setGridRows(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-columns">Grid Columns: {gridColumns}</Label>
                        <Slider id="grid-columns" min={1} max={10} step={1} value={[gridColumns]} onValueChange={(value) => setGridColumns(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-width">Barcode Width: {gridWidth.toFixed(1)}</Label>
                        <Slider id="grid-width" min={0.5} max={3} step={0.1} value={[gridWidth]} onValueChange={(value) => setGridWidth(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-height">Barcode Height: {gridHeight}</Label>
                        <Slider id="grid-height" min={10} max={100} step={5} value={[gridHeight]} onValueChange={(value) => setGridHeight(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="grid-margin">Barcode Margin: {gridMargin}</Label>
                        <Slider id="grid-margin" min={0} max={20} step={1} value={[gridMargin]} onValueChange={(value) => setGridMargin(value[0])} />
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
