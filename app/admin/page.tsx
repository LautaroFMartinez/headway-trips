'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SignIn, useUser } from '@clerk/nextjs';
import { Plane } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';
  const error = searchParams.get('error');
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push(redirectTo);
    }
  }, [isSignedIn, router, redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Plane className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Headway Trips</h1>
            <p className="text-sm text-white/60">Panel de Administración</p>
          </div>
        </div>

        {error === 'unauthorized' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-sm text-red-300">No tenés permisos de administrador.</p>
          </div>
        )}

        <div className="flex justify-center">
          <SignIn
            routing="hash"
            afterSignInUrl={redirectTo}
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-white/60',
                socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
                formFieldLabel: 'text-white/80',
                formFieldInput: 'bg-white/5 border-white/20 text-white placeholder:text-white/40',
                footerActionLink: 'text-primary hover:text-primary/80',
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                dividerLine: 'bg-white/20',
                dividerText: 'text-white/40',
              },
            }}
          />
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          Acceso restringido solo para administradores
        </p>
      </div>
    </div>
  );
}
