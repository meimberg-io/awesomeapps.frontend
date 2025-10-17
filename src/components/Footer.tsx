import Link from "next/link";

const footerLinks = [
  { name: 'Impressum', href: '/p/imprint' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto px-6 py-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

