import { BarcodeColumnGenerator } from "@/components/barcode-column-generator";
import { BarcodeGridGenerator } from "@/components/barcode-grid-generator";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between p-4">
          <Logo />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Generate Your Code128 Barcodes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Instantly create and customize barcodes from your data with AI-powered format validation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <section>
            <h3 className="text-2xl font-semibold mb-4 text-center lg:text-left font-headline text-primary">Interactive Column</h3>
            <BarcodeColumnGenerator />
          </section>
          <section className="border-t lg:border-t-0 lg:border-l lg:pl-16 pt-8 lg:pt-0 border-dashed">
             <h3 className="text-2xl font-semibold mb-4 text-center lg:text-left font-headline text-primary">Numbered Grid</h3>
            <BarcodeGridGenerator />
          </section>
        </div>
      </main>
      <footer className="border-t mt-12 py-6 md:px-8 md:py-0 bg-card">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
              Built with Next.js and Firebase.
            </p>
          </div>
      </footer>
    </div>
  );
}
