'use client';

import { Zap, ZapOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/settings-context';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AnimationSwitcher() {
  const { animationsEnabled, setAnimationsEnabled } = useSettings();

  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);
  };

  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleAnimations}>
                    {animationsEnabled ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
                    <span className="sr-only">Toggle Animations</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{animationsEnabled ? 'Disable Animations' : 'Enable Animations'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
