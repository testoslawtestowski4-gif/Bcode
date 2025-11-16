'use client';

import { BarcodeData } from "./barcode-column-generator";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ListChecks, ChevronsUpDown } from "lucide-react";

interface ConsignmentSwitcherProps {
    allBarcodes: BarcodeData[];
    activeBarcode: string | null;
    setActiveBarcode: (id: string | null) => void;
}

export function ConsignmentSwitcher({ allBarcodes, activeBarcode, setActiveBarcode }: ConsignmentSwitcherProps) {
    const activeBarcodeData = allBarcodes.find(b => b.id === activeBarcode);

    if (!activeBarcodeData) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-md border">
                <ListChecks className="w-5 h-5" />
                <span className="text-sm font-medium">No Consignment</span>
            </div>
        );
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <ListChecks className="w-5 h-5 text-primary" />
                        <span className="font-semibold font-code text-lg">{activeBarcodeData.value}</span>
                    </div>
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
    );
}
