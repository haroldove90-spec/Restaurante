'use server';

import { db } from '@/lib/supabase-client';
import { Orden, DetalleOrden } from '@/types/database';

/**
 * Server Action para crear una nueva orden.
 * Realiza la inserción de la orden, sus detalles y actualiza el inventario.
 */
export async function crearNuevaOrden(
  mesaId: string, 
  meseroId: string, 
  items: { productoId: string, cantidad: number, precio: number }[]
) {
  try {
    // 1. Calcular total
    const totalCalculado = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    // 2. Insertar la orden principal
    const { data: nuevaOrden, error: errorOrden } = await db
      .from('ordenes')
      .insert({
        mesa_id: mesaId,
        usuario_id: meseroId,
        estado: 'pendiente',
        total: totalCalculado
      })
      .select()
      .single();

    if (errorOrden) throw new Error(`Error al crear orden: ${errorOrden.message}`);

    // 3. Insertar detalles de la orden
    const detallesParaInsertar = items.map(item => ({
      orden_id: nuevaOrden.id,
      producto_id: item.productoId,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));

    const { error: errorDetalles } = await db
      .from('detalles_orden')
      .insert(detallesParaInsertar);

    if (errorDetalles) throw new Error(`Error al insertar detalles: ${errorDetalles.message}`);

    // 4. Actualizar estado de la mesa a 'ocupada'
    await db
      .from('mesas')
      .update({ estado: 'ocupada' })
      .eq('id', mesaId);

    // 5. Restar del inventario (Lógica simple: 1 producto = 1 unidad de inventario)
    // En una fase posterior se usará una tabla 'recetas' para esto
    for (const item of items) {
      const { data: inv } = await db
        .from('inventario')
        .select('stock_actual')
        .eq('producto_id', item.productoId)
        .single();

      if (inv) {
        await db
          .from('inventario')
          .update({ stock_actual: inv.stock_actual - item.cantidad })
          .eq('producto_id', item.productoId);
      }
    }

    return { success: true, ordenId: nuevaOrden.id };
  } catch (error) {
    console.error('Error en Action crearNuevaOrden:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
