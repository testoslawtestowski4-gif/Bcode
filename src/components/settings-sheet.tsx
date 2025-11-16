
'use client';

import { BarChart2, Info, Settings } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function SettingsSheet() {
  const {
    columnHeight, setColumnHeight,
    gridHeight, setGridHeight,
    isFocusMode, setIsFocusMode,
    focusModeThreshold, setFocusModeThreshold,
    focusModeVisibleRows, setFocusModeVisibleRows,
    printFontSize, setPrintFontSize,
    printFontWeight, setPrintFontWeight,
    printOrientation, setPrintOrientation,
    teamWorkEnabled, setTeamWorkEnabled,
    gamificationEnabled, setGamificationEnabled,
    totalConsignmentBarcodes, totalContainerBarcodes,
    firstGenerationDate,
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
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-lg font-medium flex items-center gap-2">
                    <BarChart2 className='w-5 h-5' />
                    Global Statistics
                  </h4>
                  {firstGenerationDate && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4 text-muted-foreground' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>First generation date: {firstGenerationDate}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Consignment Barcodes:</span>
                        <span className="font-semibold">{totalConsignmentBarcodes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Container Barcodes:</span>
                        <span className="font-semibold">{totalContainerBarcodes}</span>
                    </div>
                </div>
            </div>

            <Separator />
            
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
                        <Slider id="grid-height" min={10} max={100} step={5} value={[gridHeight]} onValueChange={(value) => setGridHeight(value[0])} />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Focus Mode</h4>
                <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="focus-mode"
                            checked={isFocusMode}
                            onCheckedChange={setIsFocusMode}
                        />
                        <Label htmlFor="focus-mode">Enable Focus Mode</Label>
                    </div>
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                      <Switch
                          id="team-work-switch"
                          checked={teamWorkEnabled}
                          onCheckedChange={setTeamWorkEnabled}
                      />
                      <Label htmlFor="team-work-switch">Enable Team Work Feature</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Switch
                          id="gamification-switch"
                          checked={gamificationEnabled}
                          onCheckedChange={setGamificationEnabled}
                          disabled={!teamWorkEnabled}
                      />
                      <Label htmlFor="gamification-switch" className={!teamWorkEnabled ? 'text-muted-foreground' : ''}>
                        Enable Gamification
                      </Label>
                  </div>
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
