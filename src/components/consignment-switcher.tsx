'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { BarcodeData } from "./barcode-column-generator";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronsUpDown, ListChecks } from "lucide-react";
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface ConsignmentSwitcherProps {
    allBarcodes: BarcodeData[];
    activeBarcode: string | null;
    setActiveBarcode: (id: string | null) => void;
}

export function ConsignmentSwitcher({ allBarcodes, activeBarcode, setActiveBarcode }: ConsignmentSwitcherProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const activeBarcodeData = allBarcodes.find(b => b.id === activeBarcode);
    
    useEffect(() => {
        if (svgRef.current && activeBarcodeData?.value) {
            try {
                JsBarcode(svgRef.current, activeBarcodeData.value, {
                    format: 'CODE128',
                    displayValue: false,
                    background: 'transparent',
                    lineColor: 'hsl(var(--foreground))',
                    height: 30,
                    width: 1.5,
                    margin: 0,
                });
            } catch (e) {
                if (svgRef.current) {
                    svgRef.current.innerHTML = '';
                }
            }
        }
    }, [activeBarcodeData]);


    if (!activeBarcodeData) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-md border h-12">
                <ListChecks className="w-5 h-5" />
                <span className="text-sm font-medium">No Consignment</span>
            </div>
        );
    }
    
    return (
        <Card className="flex items-center justify-between p-2 h-14 w-80">
            <div className="flex items-center gap-3 flex-grow overflow-hidden">
                <div className="w-32 flex-shrink-0">
                    <svg ref={svgRef} className="w-full h-auto" />
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn(
                            "font-semibold font-code text-lg",
                             allBarcodes.length > 1 && "max-w-[80px] truncate"
                        )}>
                            {activeBarcodeData.value}
                        </span>
                        {allBarcodes.length > 1 && <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                </DropdownMenuTrigger>
                {allBarcodes.length > 1 && (
                    <DropdownMenuContent align="center" className="w-64">
                        {allBarcodes.map(barcode => (
                            <DropdownMenuItem 
                                key={barcode.id} 
                                onSelect={() => setActiveBarcode(barcode.id)}
                                className="font-code text-base"
                            >
                                {barcode.value}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </Card>
    );
}
