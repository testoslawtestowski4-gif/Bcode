import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "BCode Maker",
  description: "A modern barcode generator.",
};

function AppBody({ children }: { children: React.ReactNode }) {
  'use client';

  const { theme, animationsEnabled } = useSettings();

  return (
    <body
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable,
        theme,
        !animationsEnabled && 'no-animations'
      )}
    >
        {children}
        <Toaster />
    </body>
  );
}

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
        </AppBody>
      </SettingsProvider>
    </html>
  );
}
