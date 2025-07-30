
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';

// This remains a server-side export, but since the file is 'use client', we can't export it here.
// The metadata will be defined in a parent server component if needed, or we accept this limitation for now.
// For the purpose of fixing the immediate error, we will comment it out from here.
/*
export const metadata: Metadata = {
  title: "BCode Maker",
  description: "A modern barcode generator.",
};
*/

// This component uses hooks and must be a client component.
function AppBody({ children }: { children: React.ReactNode }) {
  const { theme, animationsEnabled } = useSettings();

  return (
    <body
      className={cn(
        'font-sans antialiased',
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
      <head>
        <title>BCode Maker</title>
        <meta name="description" content="A modern barcode generator." />
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
