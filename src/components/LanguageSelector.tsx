'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {locales, Locale} from '@/types/locale';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ChevronDown} from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

const languageConfig: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'EN', flag: 'us' },
  de: { name: 'DE', flag: 'de' },
};

const CircleFlag = ({ locale }: { locale: Locale }) => {
  const flagCode = languageConfig[locale].flag;
  
  return (
    <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
      <span 
        className={`fi fi-${flagCode}`} 
        style={{ 
          fontSize: '1.25em',
          lineHeight: 1,
          display: 'block',
          transform: 'scale(1.5)',
        }}
      />
    </div>
  );
};

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.length > 1 
      ? '/' + segments.slice(1).join('/')
      : '';
    
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;

    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="link"  
          className="h-10 gap-2 px-3 hover:brightness-110 transition-all cursor-pointer" 
        >
          <CircleFlag locale={locale} />
          <span className="text-sm font-medium">{languageConfig[locale].name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchLocale(loc)}
            className="gap-2 cursor-pointer"
          >
            <CircleFlag locale={loc} />
            <span className="flex-1">{languageConfig[loc].name}</span>
            {locale === loc && <span className="text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
