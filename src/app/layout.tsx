
import type { Metadata } from 'next';
import './globals.css';
import { AppWrapper } from '@/components/app-wrapper';

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
      <AppWrapper>
        {children}
      </AppWrapper>
    </html>
  );
}
