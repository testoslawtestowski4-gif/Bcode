import { BarcodeColumnGenerator } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { Logo } from "@/components/logo";
import { SettingsSheet } from "@/components/settings-sheet";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <Logo />
          <SettingsSheet />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start mt-8">
            <div className="space-y-4 lg:col-span-3">
                <h3 className="text-2xl font-semibold text-center">Column View</h3>
                <BarcodeColumnGenerator />
            </div>
            <div className="space-y-4 lg:col-span-7">
                <h3 className="text-2xl font-semibold text-center">Grid View</h3>
                <BarcodeGridGenerator />
            </div>
        </div>
      </main>
      <footer className="border-t mt-12 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        </div>
      </footer>
    </div>
  );
}
