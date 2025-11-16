
'use client';

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function WinnerDisplay() {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000); // Disappear after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-6xl font-bold text-primary animate-bounce">
          YOU WIN!
        </h2>
      </div>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={400}
        gravity={0.15}
        run={show}
      />
    </div>
  );
}
