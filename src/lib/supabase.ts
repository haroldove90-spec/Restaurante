import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

if (!isConfigured) {
  console.warn('Las variables de entorno de Supabase no están configuradas. El sistema funcionará en modo DEMO.');
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export { isConfigured };
