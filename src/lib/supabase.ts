import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas.');
}

/**
 * Cliente de Supabase para uso en el cliente (Browser).
 * Nota: En Next.js se usaría @supabase/auth-helpers-nextjs o @supabase/ssr.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
