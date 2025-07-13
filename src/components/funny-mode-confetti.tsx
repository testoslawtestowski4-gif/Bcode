'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useSettings } from '@/context/settings-context';

export function FunnyModeConfetti() {
  const { isFunnyMode } = useSettings();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isFunnyMode) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Confetti disappears after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isFunnyMode]);

  if (!showConfetti) {
    return null;
  }

  return (
    <Confetti
      width={typeof window !== 'undefined' ? window.innerWidth : 0}
      height={typeof window !== 'undefined' ? window.innerHeight : 0}
      recycle={false}
      numberOfPieces={400}
      gravity={0.2}
    />
  );
}
