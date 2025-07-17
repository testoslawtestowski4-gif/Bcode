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

export default function Home() {
  const { isFunnyMode } = useSettings();
  const [showDraggableBarcode, setShowDraggableBarcode] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [isConsignmentCollapsed, setIsConsignmentCollapsed] = useState(false);
  const [isConsignmentLocked, setIsConsignmentLocked] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY = currentScrollY;

      if (currentScrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
  }, [isConsignmentLocked]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  return (
    <>
      <FunnyModeConfetti />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className={`sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="container mx-auto flex h-16 items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Barcode className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-primary">{isFunnyMode ? 'B-Code Clown' : 'BCode Maker'}</h1>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setShowDraggableBarcode(true)}>
                    <Barcode className="h-4 w-4" />
                    <span className="sr-only">Show Draggable Barcode</span>
                  </Button>
                  <AnimationSwitcher />
                  <ThemeSwitcher />
                  <SettingsSheet />
              </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
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
        <footer className="border-t mt-12 py-6">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          </div>
        </footer>
      </div>
      {showDraggableBarcode && <DraggableBarcode onClose={() => setShowDraggableBarcode(false)} />}
      <Button
        variant="default"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-opacity duration-300",
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
    </>
  );
}
