'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const handleSmoothScroll = useSmoothScroll(80);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/icono.png" alt="Headway Trips Logo" width={36} height={36} className="group-hover:scale-105 transition-transform duration-300" />
            <span className="text-xl font-semibold tracking-tight text-foreground">Headway Trips</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/#destinos', label: 'Destinos' },
              { href: '/comparador', label: 'Comparador' },
              { href: '/nosotros', label: 'Nosotros' },
              { href: '/#contacto', label: 'Contacto' },
            ].map((link) => (
              <Link key={link.href} href={link.href} onClick={link.href.includes('#') ? handleSmoothScroll : undefined} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/#destinos" onClick={handleSmoothScroll} className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
              Explorar destinos
            </Link>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2.5 hover:bg-secondary rounded-lg transition-colors text-foreground" aria-label="Toggle menu" aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="container mx-auto px-6 py-4 bg-background/95 backdrop-blur-md border-t border-border" aria-label="Menú móvil">
          <div className="flex flex-col gap-1">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/#destinos', label: 'Destinos' },
              { href: '/comparador', label: 'Comparador' },
              { href: '/nosotros', label: 'Nosotros' },
              { href: '/#contacto', label: 'Contacto' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={(e) => {
                  if (link.href.includes('#')) {
                    handleSmoothScroll(e);
                  }
                  setIsMenuOpen(false);
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#destinos"
              className="mt-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center"
              onClick={(e) => {
                handleSmoothScroll(e);
                setIsMenuOpen(false);
              }}
            >
              Explorar destinos
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
