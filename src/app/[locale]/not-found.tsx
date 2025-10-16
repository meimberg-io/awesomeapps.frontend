import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1>
        <p className="text-muted-foreground mb-8">
          Die von Ihnen gesuchte Seite konnte leider nicht gefunden werden.
        </p>
        <Button asChild size="lg">
          <Link href="/">
            Zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  )
}

