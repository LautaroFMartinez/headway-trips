'use client';

import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type CookiePreference = 'all' | 'necessary' | null;

const COOKIE_CONSENT_KEY = 'headway-cookie-consent';

export function getCookieConsent(): CookiePreference {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY) as CookiePreference;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'all';
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (preference: CookiePreference) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, preference!);
    setVisible(false);
    // Dispatch event so GoogleAnalytics component can react
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: preference }));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/10 items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Usamos cookies</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia de navegacion y analizar el trafico del sitio.{' '}
                    <Link href="/privacidad" className="text-primary hover:underline">
                      Politica de privacidad
                    </Link>
                  </p>
                </div>
                <button
                  onClick={() => setVisible(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {showSettings && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Cookies necesarias</p>
                      <p className="text-xs text-muted-foreground">Requeridas para el funcionamiento del sitio</p>
                    </div>
                    <div className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Siempre activas</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Cookies analiticas</p>
                      <p className="text-xs text-muted-foreground">Google Analytics para mejorar el sitio</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Opcionales</div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Button onClick={() => saveConsent('all')} size="sm">
                  Aceptar todo
                </Button>
                <Button onClick={() => saveConsent('necessary')} variant="outline" size="sm">
                  Solo necesarias
                </Button>
                {!showSettings && (
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Configurar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
