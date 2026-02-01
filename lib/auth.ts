import { cookies } from 'next/headers';
import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface SessionData {
  admin: AdminUser;
}

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/**
 * Crea un cliente de Supabase para Server Components con manejo de cookies
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Si estamos en un Server Component, no podemos setear cookies
          // El middleware se encargará de refrescar la sesión
        }
      },
    },
  });
}

/**
 * Crea un cliente de Supabase para uso en el navegador (Client Components)
 */
export function createBrowserClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Autentica al admin usando Supabase Auth
 */
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error: error?.message || 'Email o contraseña incorrectos' };
  }

  return {
    success: true,
    admin: {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin',
    },
  };
}

/**
 * Obtiene la sesión actual del admin
 */
export async function getAdminSession(): Promise<SessionData | null> {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      admin: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
      },
    };
  } catch {
    return null;
  }
}

/**
 * Cierra la sesión del admin
 */
export async function logoutAdmin(): Promise<void> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
}

/**
 * Verifica si hay una sesión activa (para middleware)
 */
export async function hasActiveSession(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}
