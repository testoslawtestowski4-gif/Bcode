
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { AppBody } from '@/components/app-body';
import { Snowfall } from '@/components/snowfall';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "BCode Maker",
  description: "A modern barcode generator.",
};

function AppWrapper({ children }: { children: React.ReactNode }) {
  'use client';

  function ConditionalSnowfall() {
    const { showSnowfall } = useSettings();
    return showSnowfall ? <Snowfall /> : null;
  }

  return (
    <SettingsProvider>
      <AppBody>
        {children}
        <ConditionalSnowfall />
        <Toaster />
      </AppBody>
    </SettingsProvider>
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
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
