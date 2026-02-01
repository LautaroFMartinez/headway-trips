'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/icono.png" alt="Headway Trips Logo" width={32} height={32} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="text-2xl font-semibold text-foreground" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Headway Trips
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link href="#destinos" className="text-muted-foreground hover:text-foreground transition-colors">
            Destinos
          </Link>
          <Link href="/comparador" className="text-muted-foreground hover:text-foreground transition-colors">
            Comparador
          </Link>
          <Link href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="#destinos" className="hidden md:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Explorar
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="#destinos" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Destinos
            </Link>
            <Link href="/comparador" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Comparador
            </Link>
            <Link href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Contacto
            </Link>
            <Link href="#destinos" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors text-center" onClick={() => setIsMenuOpen(false)}>
              Explorar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
