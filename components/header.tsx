'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const handleSmoothScroll = useSmoothScroll(80);
  const pathname = usePathname();
  
  // Solo aplicar estilos de hero en la página principal
  const isHomepage = pathname === '/';
  const isOverHero = isHomepage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text-shadow para legibilidad sobre la imagen hero (solo en homepage cuando no está scrolled)
  const heroTextShadow = isOverHero ? {
    textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
  } : {};

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomepage ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/icono.png" 
              alt="Headway Trips Logo" 
              width={36} 
              height={36} 
              className={`group-hover:scale-105 transition-transform duration-300 ${isOverHero ? 'drop-shadow-lg' : ''}`} 
            />
            <span 
              className={`text-xl font-semibold tracking-tight ${isOverHero ? 'text-white' : 'text-foreground'}`}
              style={heroTextShadow}
            >
              Headway Trips
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/#destinos', label: 'Destinos' },
              { href: '/comparador', label: 'Comparador' },
              { href: '/blog', label: 'Blog' },
              { href: '/nosotros', label: 'Nosotros' },
              { href: '/#contacto', label: 'Contacto' },
            ].map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={link.href.includes('#') ? handleSmoothScroll : undefined} 
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isOverHero 
                    ? 'text-white/90 hover:text-white hover:bg-white/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
                style={heroTextShadow}
              >
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
              { href: '/blog', label: 'Blog' },
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
