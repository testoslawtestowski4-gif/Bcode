import { BarcodeColumnGenerator } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <Logo />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
            Barcode Generator
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Wklej swoje dane, aby natychmiast wygenerować kody kreskowe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-center">Widok kolumnowy</h3>
                <BarcodeColumnGenerator />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-center">Widok siatki</h3>
                <BarcodeGridGenerator />
            </div>
        </div>
      </main>
      <footer className="border-t mt-12 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Zbudowano z Next.js i ShadCN.
          </p>
        </div>
      </footer>
    </div>
  );
}
