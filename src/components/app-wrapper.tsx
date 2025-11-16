'use client';

import { SettingsProvider, useSettings } from '@/context/settings-context';
import { AppBody } from '@/components/app-body';
import Snowfall from '@/components/snowfall';
import { ReactNode } from 'react';

function ConditionalSnowfall() {
  const { showSnowfall } = useSettings();
  if (!showSnowfall) return null;
  return <Snowfall />;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AppBody>
        {children}
        <ConditionalSnowfall />
      </AppBody>
    </SettingsProvider>
  );
}
