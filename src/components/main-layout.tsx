'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { useSettings } from '@/context/settings-context';

interface MainLayoutProps {
    children: [ReactNode, ReactNode];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    isTeamWorkActive: boolean;
}

export function MainLayout({ children, isCollapsed, setIsCollapsed, isTeamWorkActive }: MainLayoutProps) {
    const { animationsEnabled } = useSettings();
    const isSpeedMode = !animationsEnabled;
    const [consignmentView, containerView] = children;

    const effectiveIsCollapsed = isSpeedMode ? false : isCollapsed;

    if (isTeamWorkActive) {
        return (
            <div className="flex flex-col gap-8 items-start relative mt-8">
                <div id="consignment-view-wrapper" className="w-full">
                    {consignmentView}
                </div>
                <div id="container-view" className="w-full">
                    {containerView}
                </div>
            </div>
        );
    }
    
    const consignmentWidth = effectiveIsCollapsed ? 'lg:w-[120px]' : 'lg:w-[35%]';
    const containerWidth = effectiveIsCollapsed ? 'lg:w-[calc(100% - 120px - 2rem)]' : 'lg:w-[65%]';

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
            <div
                id="consignment-view-wrapper"
                className={cn(
                    'w-full lg:flex-shrink-0 relative',
                    'transition-all duration-500 ease-in-out',
                    consignmentWidth
                )}
            >
                <div
                    id="consignment-view"
                    className={cn(
                        'transition-opacity duration-300',
                        effectiveIsCollapsed && 'opacity-0 h-0 pointer-events-none'
                    )}
                >
                    {consignmentView}
                </div>
                {effectiveIsCollapsed && !isSpeedMode && (
                    <div className="hidden lg:block sticky top-20 w-[120px]">
                         <div className="h-full w-full" style={{height: 'calc(100vh - 12rem)'}}>
                            <Button 
                                className="w-full h-full text-lg"
                                variant="outline"
                                onClick={() => setIsCollapsed(false)}
                            >
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Eye className="w-8 h-8" />
                                    <span>Show List</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div
                id="container-view"
                className={cn(
                    'w-full flex-grow',
                    'transition-all duration-500 ease-in-out',
                    containerWidth
                )}
            >
                {containerView}
            </div>
        </div>
    );
}
