import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errors');
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('404Title')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('404Description')}
        </p>
        <Button asChild size="lg">
          <Link href="/">
            {t('toHomepage')}
          </Link>
        </Button>
      </div>
    </div>
  )
}

