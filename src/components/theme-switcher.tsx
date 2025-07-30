'use client';

import { Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings } from '@/context/settings-context';

export function ThemeSwitcher() {
  const { setTheme } = useSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('sleek-theme')}>
          Sleek
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('pink-theme')}>
          Feminine
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('classic-blue-theme')}>
          Classic Blue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
