'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    children: [ReactNode, ReactNode];
    isTeamWorkActive: boolean;
}

export function MainLayout({ children, isTeamWorkActive }: MainLayoutProps) {
    const [consignmentView, containerView] = children;

    return (
        <div className={cn("grid grid-cols-10 gap-8 items-start mt-8")}>
            <div id="consignment-view-wrapper" className={cn(
                'col-span-10 lg:col-span-3 relative',
                isTeamWorkActive && 'hidden'
            )}>
                {consignmentView}
            </div>
            <div id="container-view" className={cn(
                'col-span-10 flex-grow',
                !isTeamWorkActive && 'lg:col-span-7'
            )}>
                {containerView}
            </div>
        </div>
    );
}
