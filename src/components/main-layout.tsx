
'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { VerticalBarcode } from './vertical-barcode';

interface MainLayoutProps {
    children: [ReactNode, ReactNode];
    isCollapsed: boolean;
}

export function MainLayout({ children, isCollapsed }: MainLayoutProps) {
    const [consignmentView, containerView] = children;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start relative mt-8">
            <div
                id="consignment-view-wrapper"
                className={cn(
                    'w-full lg:w-[35%] lg:flex-shrink-0 transition-all duration-500 ease-in-out',
                    isCollapsed && 'lg:w-[250px]'
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
                    <div className="hidden lg:block absolute top-0 left-0 w-[250px] h-full transition-opacity duration-500 ease-in-out">
                         <div className="h-full w-full" style={{height: 'calc(100vh - 200px)'}}>
                            <VerticalBarcode value="INSHIP01" />
                        </div>
                    </div>
                )}
            </div>
            <div
                id="container-view"
                className={cn(
                    'w-full transition-all duration-500 ease-in-out flex-grow',
                    isCollapsed ? 'lg:w-[calc(100%-250px)]' : 'lg:w-[65%]'
                )}
            >
                {containerView}
            </div>
        </div>
    );
}
