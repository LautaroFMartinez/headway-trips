import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Verifica si las variables de entorno de Supabase están configuradas
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Cliente de Supabase para uso en el cliente y server components
 * Nota: Retorna null si las variables de entorno no están configuradas
 */
function createSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    // Durante el build o si no hay configuración, retornar null
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient();

/**
 * Obtiene el cliente de Supabase o lanza un error si no está configurado
 * Usar en lugares donde Supabase es requerido
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
  return supabase;
}

/**
 * Cliente para uso en Server Components (con service role key para operaciones admin)
 */
export function createServerClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    // Fallback al cliente anónimo si no hay service role key
    return supabase;
  }
  
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
