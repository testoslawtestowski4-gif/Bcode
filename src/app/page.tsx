'use client'; // This is necessary for useState and event handlers

import { useState } from 'react';
import { BarcodeColumnGenerator } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { SettingsSheet } from "@/components/settings-sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DraggableBarcode } from '@/components/draggable-barcode';
import { Button } from '@/components/ui/button';
import { Barcode } from 'lucide-react';

export default function Home() {
  const [showDraggableBarcode, setShowDraggableBarcode] = useState(false);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between p-4">
              <h1 className="text-3xl font-bold text-destructive">B-code Generator</h1>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setShowDraggableBarcode(true)}>
                    <Barcode className="h-4 w-4" />
                    <span className="sr-only">Show Draggable Barcode</span>
                  </Button>
                  <ThemeSwitcher />
                  <SettingsSheet />
              </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start mt-8">
              <div className="space-y-4 lg:col-span-3">
                  <BarcodeColumnGenerator />
              </div>
              <div className="space-y-4 lg:col-span-7">
                  <BarcodeGridGenerator />
              </div>
          </div>
        </main>
        <footer className="border-t mt-12 py-6">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          </div>
        </footer>
      </div>
      {showDraggableBarcode && <DraggableBarcode onClose={() => setShowDraggableBarcode(false)} />}
    </>
  );
}
