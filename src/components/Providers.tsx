'use client';

import {ReactNode} from 'react';
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";

export default function Providers({children}: { children: ReactNode }) {
    return (
        <TooltipProvider>
            {children}
            <Toaster />
        </TooltipProvider>
    );
}

