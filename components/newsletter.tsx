'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NewsletterProps {
  variant?: 'section' | 'inline';
  className?: string;
}

export function Newsletter({ variant = 'section', className }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al suscribirse');
      }

      setIsSubscribed(true);
      setEmail('');
      toast.success('¡Te suscribiste exitosamente!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al suscribirse');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-10"
          disabled={isLoading || isSubscribed}
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isLoading || isSubscribed}
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-10 px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  return (
    <section className={cn('py-16 md:py-20 relative overflow-hidden', className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary" />
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-6">
            <Mail className="h-8 w-8 text-accent" />
          </div>

          {/* Text */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Recibí ofertas <span className="font-serif italic text-accent">exclusivas</span>
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Suscribite a nuestro newsletter y enterate antes que nadie de nuestras propuestas grupales
          </p>

          {/* Form */}
          {isSubscribed ? (
            <div className="bg-accent/20 rounded-xl p-6 inline-flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-primary-foreground font-medium">
                ¡Gracias por suscribirte!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12 flex-1"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-6 font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Suscribirme
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Privacy note */}
          <p className="text-primary-foreground/60 text-xs mt-4">
            Al suscribirte aceptas recibir emails de Headway Trips. Podes darte de baja en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
