'use client';

import {ReactNode} from 'react';
import {SessionProvider} from "next-auth/react";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/toaster";
import {MemberProvider} from "@/contexts/MemberContext";

export default function Providers({children}: { children: ReactNode }) {
    return (
        <SessionProvider>
            <MemberProvider>
                <TooltipProvider>
                    {children}
                    <Toaster />
                </TooltipProvider>
            </MemberProvider>
        </SessionProvider>
    );
}

