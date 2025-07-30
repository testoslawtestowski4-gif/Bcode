import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from '@/context/settings-context';
import { AppBody } from '@/components/app-body';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: "BCode Maker",
  description: "A modern barcode generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <SettingsProvider>
        <AppBody>
          {children}
          <Toaster />
        </AppBody>
      </SettingsProvider>
    </html>
  );
}
