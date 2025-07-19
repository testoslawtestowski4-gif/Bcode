'use client';

import React from 'react';

export function Snowfall() {
  const snowflakes = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`,
      animationDelay: `${Math.random() * 10}s`,
    };
    return <div key={i} className="snowflake" style={style} />;
  });

  return <div className="snowfall">{snowflakes}</div>;
}
