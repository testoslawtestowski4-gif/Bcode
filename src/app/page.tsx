'use client';

import { useState, useEffect } from 'react';
import { BarcodeColumnGenerator } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { SettingsSheet } from "@/components/settings-sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DraggableBarcode } from '@/components/draggable-barcode';
import { Button } from '@/components/ui/button';
import { Barcode, ArrowUp } from 'lucide-react';
import { MainLayout } from '@/components/main-layout';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/settings-context';
import { FunnyModeConfetti } from '@/components/funny-mode-confetti';
import { AnimationSwitcher } from '@/components/animation-switcher';
import { XmasSnowfall } from '@/components/xmas-snowfall';

export default function Home() {
  const { isFunnyMode, animationsEnabled, theme } = useSettings();
  const [showDraggableBarcode, setShowDraggableBarcode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const isSleekTheme = theme === 'sleek-theme';

  // When animations are disabled, the consignment view is always visible and locked.
  const isSpeedMode = !animationsEnabled;
  const [isConsignmentCollapsed, setIsConsignmentCollapsed] = useState(isSpeedMode ? false : true);
  const [isConsignmentLocked, setIsConsignmentLocked] = useState(isSpeedMode);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // In speed mode, the panel is always open and locked.
    if (isSpeedMode) {
      setIsConsignmentCollapsed(false);
      setIsConsignmentLocked(true);
      return;
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (isConsignmentLocked) return;
      const columnEl = document.getElementById('consignment-view');
      const gridEl = document.getElementById('container-view');
      
      if (columnEl && !columnEl.contains(event.target as Node) && gridEl && gridEl.contains(event.target as Node)) {
        setIsConsignmentCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isConsignmentLocked, isSpeedMode]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <>
      <FunnyModeConfetti />
      <XmasSnowfall />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className={cn("w-full bg-background/95 backdrop-blur-sm z-10", !isSleekTheme && "border-b border-border")}>
          <div className="container mx-auto flex h-16 items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Barcode className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-primary">{isFunnyMode ? 'B-Code Clown' : 'BCode Maker'}</h1>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setShowDraggableBarcode(!showDraggableBarcode)}>
                    <Barcode className="h-4 w-4" />
                    <span className="sr-only">Show Draggable Barcode</span>
                  </Button>
                  <AnimationSwitcher />
                  <ThemeSwitcher />
                  <SettingsSheet />
              </div>
          </div>
        </header>
        <main className={cn("flex-grow container mx-auto p-4 sm:p-6 md:p-8", showDraggableBarcode && "pt-44")}>
            <MainLayout isCollapsed={isConsignmentCollapsed} setIsCollapsed={setIsConsignmentCollapsed}>
                <BarcodeColumnGenerator 
                    isCollapsed={isConsignmentCollapsed}
                    setIsCollapsed={setIsConsignmentCollapsed}
                    isLocked={isConsignmentLocked}
                    setIsLocked={setIsConsignmentLocked}
                />
                <BarcodeGridGenerator />
            </MainLayout>
        </main>
        {!isSleekTheme && (
          <footer className="border-t mt-12 py-6">
            <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            </div>
          </footer>
        )}
      </div>
      {showDraggableBarcode && <DraggableBarcode onClose={() => setShowDraggableBarcode(false)} />}
      <Button
        variant="default"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg",
          "transition-opacity duration-300",
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    </>
  );
}
