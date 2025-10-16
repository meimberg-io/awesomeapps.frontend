'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, UserCircle, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/types/locale';

export function UserButton() {
  const { data: session, status } = useSession();
  const t = useTranslations('auth');
  const locale = useLocale() as Locale;

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        {t('signIn')}...
      </Button>
    );
  }

  if (status === "unauthenticated") {
    return (
      <button 
        onClick={() => signIn()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:brightness-150 transition-all cursor-pointer"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{t('signIn')}</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:brightness-110 transition-all cursor-pointer">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {session?.user?.name || t('profile')}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${locale}/profile`}>
            <UserCircle className="h-4 w-4 mr-2" />
            {t('profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={`/${locale}/favorites`}>
            <Heart className="h-4 w-4 mr-2" />
            {t('myFavorites')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

