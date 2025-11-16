
'use client';

import { SettingsProvider, useSettings } from '@/context/settings-context';
import { AppBody } from '@/components/app-body';
import { Snowfall } from '@/components/snowfall';
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from 'react';

function ConditionalSnowfall() {
  const { showSnowfall } = useSettings();
  return showSnowfall ? <Snowfall /> : null;
}

export function AppWrapper({ children }: { children: ReactNode }) {
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
