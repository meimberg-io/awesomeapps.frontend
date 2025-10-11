'use client';

import {ReactNode} from 'react';
import {SessionProvider} from "next-auth/react";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";

export default function Providers({children}: { children: ReactNode }) {
    return (
        <SessionProvider>
            <TooltipProvider>
                {children}
                <Toaster />
            </TooltipProvider>
        </SessionProvider>
    );
}

