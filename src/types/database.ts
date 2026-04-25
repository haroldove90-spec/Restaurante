export type UserRole = 'admin' | 'mesero' | 'cocinero' | 'cajero';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  creado_en: string;
}

export interface Mesa {
  id: string;
  numero: number;
  capacidad: number;
  estado: 'libre' | 'ocupada' | 'reservada';
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  costo: number;
  categoria_id: string;
}

export interface Orden {
  id: string;
  mesa_id: string;
  usuario_id: string;
  estado: 'pendiente' | 'preparando' | 'listo' | 'pagado' | 'cancelado';
  total: number;
  creado_en: string;
}

export interface DetalleOrden {
  id: string;
  orden_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Inventario {
  id: string;
  producto_id: string;
  stock_actual: number;
  stock_minimo: number;
  ultima_actualizacion: string;
}
