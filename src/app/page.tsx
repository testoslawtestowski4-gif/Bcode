
'use client';

import { useState, useEffect } from 'react';
import { BarcodeColumnGenerator, BarcodeData, isValidBarcode } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { SettingsSheet } from "@/components/settings-sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DraggableBarcode } from '@/components/draggable-barcode';
import { Button } from '@/components/ui/button';
import { Barcode, ArrowUp } from 'lucide-react';
import { MainLayout } from '@/components/main-layout';
import { cn } from '@/lib/utils';
import { useSettings } from '@/context/settings-context';

export default function Home() {
  const { theme } = useSettings();
  const [showDraggableBarcode, setShowDraggableBarcode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTeamWorkActive, setIsTeamWorkActive] = useState(false);

  // State for consignment view
  const [consignmentInputValue, setConsignmentInputValue] = useState('');
  const [allConsignmentBarcodes, setAllConsignmentBarcodes] = useState<BarcodeData[]>([]);
  const [activeConsignmentBarcode, setActiveConsignmentBarcode] = useState<string | null>(null);
  
  // State for container view (barcodes count)
  const [containerBarcodeCount, setContainerBarcodeCount] = useState(0);
  const [containerInputValue, setContainerInputValue] = useState('');

  const isSleekTheme = theme === 'sleek-theme';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleConsignmentCodeDetected = (code: string) => {
    if (!isValidBarcode(code)) return;

    let newActiveId = null;

    setAllConsignmentBarcodes(prevBarcodes => {
      const existingBarcode = prevBarcodes.find(b => b.value === code);
      let newBarcodes = [...prevBarcodes];

      if (existingBarcode) {
        newBarcodes = newBarcodes.filter(b => b.id !== existingBarcode.id);
        newBarcodes.unshift(existingBarcode);
        newActiveId = existingBarcode.id;
      } else {
        const newBarcode: BarcodeData = { id: `${code}-${Date.now()}`, value: code };
        newBarcodes.unshift(newBarcode);
        newActiveId = newBarcode.id;
      }
      return newBarcodes;
    });

    if (newActiveId) {
      setActiveConsignmentBarcode(newActiveId);
    }
  };
  
  const activeConsignmentCodeValue = allConsignmentBarcodes.find(b => b.id === activeConsignmentBarcode)?.value || null;
  
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className={cn(
            "w-full bg-background/95 backdrop-blur-sm z-10", 
            !isSleekTheme && "border-b border-border"
        )}>
          <div className="container mx-auto flex h-16 items-center justify-between p-4 relative">
              <div className="flex items-center gap-3">
                <Barcode className="h-8 w-8 text-primary" />
                <h1 className={cn("text-3xl font-bold text-primary")}>
                  BCode Maker
                </h1>
              </div>

              <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setShowDraggableBarcode(!showDraggableBarcode)}>
                    <Barcode className="h-4 w-4" />
                    <span className="sr-only">Show Draggable Barcode</span>
                  </Button>
                  <ThemeSwitcher />
                  <SettingsSheet />
              </div>
          </div>
        </header>
        <main className={cn("flex-grow container mx-auto p-4 sm:p-6 md:p-8", showDraggableBarcode && "pt-44")}>
            <MainLayout isTeamWorkActive={isTeamWorkActive}>
                <BarcodeColumnGenerator 
                    inputValue={consignmentInputValue}
                    setInputValue={setConsignmentInputValue}
                    allBarcodes={allConsignmentBarcodes}
                    setAllBarcodes={setAllConsignmentBarcodes}
                    activeBarcode={activeConsignmentBarcode}
                    setActiveBarcode={setActiveConsignmentBarcode}
                />
                <BarcodeGridGenerator 
                  inputValue={containerInputValue}
                  setInputValue={setContainerInputValue}
                  onConsignmentCodeDetected={handleConsignmentCodeDetected} 
                  activeConsignmentCodeValue={activeConsignmentCodeValue}
                  isTeamWorkActive={isTeamWorkActive}
                  setIsTeamWorkActive={setIsTeamWorkActive}
                  setContainerBarcodeCount={setContainerBarcodeCount}
                  allConsignmentBarcodes={allConsignmentBarcodes}
                  activeConsignmentBarcode={activeConsignmentBarcode}
                  setActiveConsignmentBarcode={setActiveConsignmentBarcode}
                />
            </MainLayout>
        </main>
        {!isSleekTheme && (
          <footer className="mt-12 py-6 border-t">
            <div className="container flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">
                  © <a href="mailto:suchecki.damian@gmail.com" className="underline hover:text-primary">Damian Suchecki</a> · ✉ suchecki.damian@gmail.com
                </p>
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
