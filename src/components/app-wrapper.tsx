
'use client';

import { SettingsProvider } from '@/context/settings-context';
import { AppBody } from '@/components/app-body';
import { ReactNode } from 'react';

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AppBody>
        {children}
      </AppBody>
    </SettingsProvider>
  );
}
