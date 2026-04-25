import { supabase } from '../lib/supabase';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre');
  if (error) throw error;
  return data;
};

export const getInventory = async () => {
  const { data, error } = await supabase
    .from('inventario')
    .select('*, productos(*)');
  if (error) throw error;
  return data;
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('ordenes')
    .select(`
      *,
      mesas (numero),
      usuarios (nombre),
      detalles_orden (*, productos(nombre))
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAdminStats = async () => {
  const { data: sales, error: salesError } = await supabase
    .from('ordenes')
    .select('total, estado, created_at');
  
  const { data: stock, error: stockError } = await supabase
    .from('inventario')
    .select('stock_actual, stock_minimo, productos(nombre)')
    .lt('stock_actual', supabase.from('inventario').select('stock_minimo'));

  if (salesError || stockError) throw (salesError || stockError);

  const totalRevenue = sales?.filter(o => o.estado === 'pagado').reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const activeOrders = sales?.filter(o => o.estado !== 'pagado' && o.estado !== 'cancelado').length || 0;
  
  return {
    totalRevenue,
    activeOrders,
    criticalStock: stock || []
  };
};

export const updateStock = async (id: string, nuevoStock: number) => {
  const { data, error } = await supabase
    .from('inventario')
    .update({ stock_actual: nuevoStock, updated_at: new Date() })
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const getTables = async () => {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('numero');
  if (error) throw error;
  return data;
};

export const upsertTable = async (table: any) => {
  const { data, error } = await supabase
    .from('mesas')
    .upsert(table)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTable = async (id: string) => {
  const { error } = await supabase
    .from('mesas')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('productos')
    .select(`
      *,
      categorias (nombre),
      inventario (stock_actual)
    `)
    .order('nombre');
  if (error) throw error;
  return data;
};

export const upsertProduct = async (product: any) => {
  // Eliminar campos relacionados que no se deben enviar al upsert
  const { categorias, inventario, ...cleanProduct } = product;
  
  const { data, error } = await supabase
    .from('productos')
    .upsert(cleanProduct)
    .select()
    .single();
  if (error) throw error;

  // Si no hay registro de inventario, crearlo
  if (data && !product.inventario) {
    await supabase.from('inventario').upsert({
      producto_id: data.id,
      stock_actual: 0,
      stock_minimo: 5
    });
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

/**
 * Crea una orden completa con sus detalles.
 * En Supabase, esto debería ser preferiblemente una función RPC para asegurar atomicidad.
 */
export const createOrder = async (mesaId: string, meseroId: string, items: any[]) => {
  // 1. Crear la cabecera de la orden
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  const { data: order, error: orderError } = await supabase
    .from('ordenes')
    .insert({
      mesa_id: mesaId,
      mesero_id: meseroId,
      total: total,
      estado: 'pendiente'
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Insertar detalles
  const details = items.map(p => ({
    orden_id: order.id,
    producto_id: p.id,
    cantidad: p.cantidad,
    precio_unitario: p.precio
  }));

  const { error: detailsError } = await supabase
    .from('detalles_orden')
    .insert(details);

  if (detailsError) throw detailsError;

  // 3. Actualizar estado de la mesa
  await supabase
    .from('mesas')
    .update({ estado: 'ocupada' })
    .eq('id', mesaId);

  return order;
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const { data, error } = await supabase
    .from('ordenes')
    .update({ estado: newStatus })
    .eq('id', orderId);
  
  if (error) throw error;
  return data;
};

export const subscribeToOrders = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:ordenes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes' }, callback)
    .subscribe();
};
