
'use client';

import React from 'react';

const Snowfall = () => {
  const snowflakeCount = 50;

  return (
    <div className="snowfall-container pointer-events-none fixed inset-0 z-50">
      {Array.from({ length: snowflakeCount }).map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={
            {
              '--size': `${Math.random() * 0.2 + 0.1}rem`,
              '--left-initial': `${Math.random() * 100}vw`,
              '--left-final': `${Math.random() * 100}vw`,
              '--animation-delay': `${Math.random() * -10}s`,
              '--animation-duration': `${5 + Math.random() * 5}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default Snowfall;
