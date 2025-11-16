'use client';

import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/context/settings-context';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';

export function SettingsSheet() {
  const {
    columnHeight, setColumnHeight,
    gridHeight, setGridHeight,
    focusModeThreshold, setFocusModeThreshold,
    focusModeVisibleRows, setFocusModeVisibleRows,
    printFontSize, setPrintFontSize,
    printFontWeight, setPrintFontWeight,
    printOrientation, setPrintOrientation,
    teamWorkEnabled, setTeamWorkEnabled
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
                        <Slider id="grid-height" min={10} max={100} step={5} value={[gridHeight]} onValuecChange={(value) => setGridHeight(value[0])} />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Focus Mode</h4>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="focus-threshold">Auto-enable threshold: {focusModeThreshold} barcodes</Label>
                        <Slider id="focus-threshold" min={10} max={50} step={1} value={[focusModeThreshold]} onValueChange={(value) => setFocusModeThreshold(value[0])} />
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                        <Label>Visible rows in Focus Mode</Label>
                        <RadioGroup 
                            value={String(focusModeVisibleRows)} 
                            onValueChange={(value) => setFocusModeVisibleRows(Number(value))}
                            className="flex space-x-4"
                        >
                            {[1, 2, 3, 4].map(rows => (
                                <div key={rows} className="flex items-center space-x-2">
                                    <RadioGroupItem value={String(rows)} id={`rows-${rows}`} />
                                    <Label htmlFor={`rows-${rows}`}>{rows}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h4 className="text-lg font-medium mb-4">Team Work</h4>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="team-work-switch"
                        checked={teamWorkEnabled}
                        onCheckedChange={setTeamWorkEnabled}
                    />
                    <Label htmlFor="team-work-switch">Enable Team Work Feature</Label>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Printing</h4>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="font-size-slider">Font Size: {printFontSize}pt</Label>
                        <Slider
                            id="font-size-slider"
                            min={20}
                            max={300}
                            step={10}
                            value={[printFontSize]}
                            onValueChange={(value) => setPrintFontSize(value[0])}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="font-weight-switch"
                            checked={printFontWeight}
                            onCheckedChange={setPrintFontWeight}
                        />
                        <Label htmlFor="font-weight-switch">Bold Text</Label>
                    </div>
                    <div className="space-y-2">
                        <Label>Page Orientation</Label>
                        <RadioGroup
                            value={printOrientation}
                            onValueChange={(value: 'landscape' | 'portrait') => setPrintOrientation(value)}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="landscape" id="orientation-landscape" />
                                <Label htmlFor="orientation-landscape">Landscape</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="portrait" id="orientation-portrait" />
                                <Label htmlFor="orientation-portrait">Portrait</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
