/**
 * Cliente de Supabase (Simulado para fines de demostración)
 * En una implementación real, aquí se usaría @supabase/supabase-js
 */

const mockDb: any = {
  from: (table: string) => ({
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { id: 'mock-id-' + Math.random() }, error: null })
      }),
      error: null
    }),
    update: (data: any) => ({
      eq: (col: string, val: any) => Promise.resolve({ error: null })
    }),
    select: (query: string) => ({
      eq: (col: string, val: any) => ({
        single: () => Promise.resolve({ data: { stock_actual: 100 }, error: null })
      })
    })
  })
};

export const db = mockDb;
