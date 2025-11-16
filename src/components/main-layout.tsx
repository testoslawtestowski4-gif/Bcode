'use client';

import { ReactNode } from 'react';

interface MainLayoutProps {
    children: [ReactNode, ReactNode];
    isTeamWorkActive: boolean;
}

export function MainLayout({ children, isTeamWorkActive }: MainLayoutProps) {
    const [consignmentView, containerView] = children;

    if (isTeamWorkActive) {
        return (
            <div className="flex flex-col gap-8 items-start relative mt-8">
                <div id="container-view" className="w-full">
                    {containerView}
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
            <div id="consignment-view-wrapper" className='w-full lg:w-[30%] lg:flex-shrink-0 relative'>
                {consignmentView}
            </div>
            <div id="container-view" className='w-full lg:w-[70%] flex-grow'>
                {containerView}
            </div>
        </div>
    );
}
