'use client';

import Snowfall from 'react-snowfall';
import { useSettings } from '@/context/settings-context';

export function XmasSnowfall() {
  const { isXmasMode } = useSettings();

  if (!isXmasMode) {
    return null;
  }

  return (
    <Snowfall
      snowflakeCount={150}
      speed={[0.5, 2.0]}
      wind={[-0.5, 1.5]}
      radius={[1.0, 3.0]}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );
}
