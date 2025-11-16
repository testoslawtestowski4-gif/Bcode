
'use client';

import { useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';
import { Inter, Source_Code_Pro } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
  weight: ['400', '500'],
});

export function AppBody({ children }: { children: React.ReactNode }) {
  const { theme } = useSettings();

  return (
    <body
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable,
        sourceCodePro.variable,
        theme
      )}
    >
      {children}
      <Toaster />
    </body>
  );
}
