'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/icono.png" alt="Headway Trips Logo" width={36} height={36} className="object-contain" />
            <span className="text-xl font-semibold text-foreground">Headway Trips</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Algo salio mal</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Ocurrio un error inesperado. Por favor, intenta nuevamente o volve al inicio.
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6 font-mono bg-secondary/50 inline-block px-3 py-1 rounded">
              Error: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => reset()} size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary-foreground/70 text-sm">
            2025 Headway Trips. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
