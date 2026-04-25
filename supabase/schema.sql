// Simulación de los scripts SQL para Supabase Dashbaord

/*
-- TABLA: usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT CHECK (rol IN ('admin', 'mesero', 'cocinero', 'cajero')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: mesas
CREATE TABLE mesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero INTEGER NOT NULL,
  capacidad INTEGER NOT NULL,
  estado TEXT DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada'))
);

-- TABLA: ordenes
CREATE TABLE ordenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mesa_id UUID REFERENCES mesas(id),
  usuario_id UUID REFERENCES usuarios(id),
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'pagado', 'cancelado')),
  total NUMERIC(10,2) DEFAULT 0,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA: detalles_orden
CREATE TABLE detalles_orden (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC(10,2) NOT NULL
);

-- SEED DATA (CONCEPTUAL)
-- Nota: La inserción en auth.users se hace vía Dashboard o API, 
-- pero aquí definimos los perfiles vinculados por ID.

/*
-- Insertar Roles
INSERT INTO roles (id, nombre) VALUES 
  (uuid_generate_v4(), 'admin'),
  (uuid_generate_v4(), 'mesero'),
  (uuid_generate_v4(), 'cocinero'),
  (uuid_generate_v4(), 'cajero');

-- Insertar Usuarios de Prueba (Asumiendo IDs generados)
-- Admin: admin@cossma.com.mx
-- Mesero: mesero@cossma.com.mx
-- Cocinero: cocinero@cossma.com.mx
*/

-- POLÍTICAS RLS (Seguridad)
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Meseros gestionan sus propias ordenes"
ON ordenes FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role' = 'mesero' AND usuario_id = auth.uid()) OR
  (auth.jwt() ->> 'role' = 'admin')
);

CREATE POLICY "Cocineros ven todas las ordenes pendientes"
ON ordenes FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'cocinero' AND estado IN ('pendiente', 'preparando'));

CREATE POLICY "Cocineros actualizan estado a listo"
ON ordenes FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'cocinero')
WITH CHECK (estado = 'listo');
*/
