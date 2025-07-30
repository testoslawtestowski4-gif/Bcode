'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';

// This remains a server-side export
export const metadata: Metadata = {
  title: "BCode Maker",
  description: "A modern barcode generator.",
};

// This component uses hooks and must be a client component.
function AppBody({ children }: { children: React.ReactNode }) {
  const { theme, animationsEnabled } = useSettings();

  return (
    <body
      className={cn(
        'font-body antialiased',
        theme,
        !animationsEnabled && 'no-animations',
        theme === 'classic-blue-theme' && 'bg-background'
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <SettingsProvider>
        <AppBody>
          {children}
        </AppBody>
      </SettingsProvider>
    </html>
  );
}
