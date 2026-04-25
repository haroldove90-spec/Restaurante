import { supabase } from '../lib/supabase';

export const getInventory = async () => {
  const { data, error } = await supabase
    .from('inventario')
    .select('*, productos(*)');
  if (error) throw error;
  return data;
};

export const updateStock = async (id: string, nuevoStock: number) => {
  const { data, error } = await supabase
    .from('inventario')
    .update({ stock_actual: nuevoStock, updated_at: new Date() })
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('productos')
    .select('*, categorias(*)');
  if (error) throw error;
  return data;
};

export const upsertProduct = async (product: any) => {
  const { data, error } = await supabase
    .from('productos')
    .upsert(product);
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
