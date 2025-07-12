'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';

interface MainLayoutProps {
    children: [ReactNode, ReactNode];
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function MainLayout({ children, isCollapsed, setIsCollapsed }: MainLayoutProps) {
    const [consignmentView, containerView] = children;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
            <div
                id="consignment-view-wrapper"
                className={cn(
                    'w-full lg:w-[35%] lg:flex-shrink-0 transition-all duration-500 ease-in-out relative',
                    isCollapsed && 'lg:w-[120px]'
                )}
            >
                <div
                    id="consignment-view"
                    className={cn(
                        'transition-opacity duration-300',
                        isCollapsed && 'opacity-0 h-0 pointer-events-none'
                    )}
                >
                    {consignmentView}
                </div>
                {isCollapsed && (
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
                    'w-full transition-all duration-500 ease-in-out flex-grow',
                    isCollapsed ? 'lg:w-[calc(100% - 120px - 2rem)]' : 'lg:w-[65%]'
                )}
            >
                {containerView}
            </div>
        </div>
    );
}
