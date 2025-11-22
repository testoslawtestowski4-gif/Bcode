
'use client';

import React from 'react';
import './snow-effect.css';

export const SnowEffect = () => {
  const snowflakes = Array.from({ length: 50 });
  return (
    <div className="snow-container">
      {snowflakes.map((_, i) => (
        <div key={i} className="snow"></div>
      ))}
    </div>
  );
};
