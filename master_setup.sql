-- PHASE 10: MASTER DATABASE SETUP (TRANSACTIONAL & REALTIME)
-- Run this in Supabase SQL Editor

-- 1. CLEANUP (Careful with dependencies)
DROP TABLE IF EXISTS detalles_orden CASCADE;
DROP TABLE IF EXISTS ordenes CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 2. CORE TABLES SETUP
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'mesero', 'cocinero', 'cajero', 'cliente')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT UNIQUE NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0,
    costo DECIMAL(10,2) DEFAULT 0,
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE UNIQUE,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero INTEGER UNIQUE NOT NULL,
    capacidad INTEGER NOT NULL DEFAULT 4,
    estado TEXT DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada')),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ordenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mesa_id UUID REFERENCES mesas(id) ON DELETE SET NULL,
    mesero_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    total DECIMAL(10,2) DEFAULT 0,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'pagado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE detalles_orden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- 3. ENABLING REALTIME
-- Note: You MUST also enable this in the Supabase Dashboard under 'Realtime'
ALTER PUBLICATION supabase_realtime ADD TABLE ordenes;
ALTER PUBLICATION supabase_realtime ADD TABLE mesas;
ALTER PUBLICATION supabase_realtime ADD TABLE productos;

-- 4. SAMPLE DATA
-- Users
INSERT INTO usuarios (email, nombre, rol) VALUES
('admin@cossma.com.mx', 'Administrador General', 'admin'),
('mesero@cossma.com.mx', 'Juan Mesero', 'mesero'),
('cocinero@cossma.com.mx', 'Chef Executivo', 'cocinero'),
('invitado@cossma.com.mx', 'Cliente Invitado', 'cliente');

-- Categories
INSERT INTO categorias (nombre) VALUES
('Entradas'),
('Platos Fuertes'),
('Bebidas'),
('Postres');

-- Products & Inventory
DO $$ 
DECLARE 
    ent_id UUID;
    pla_id UUID;
    beb_id UUID;
    pos_id UUID;
    prod_id UUID;
    admin_id UUID;
    mesero_id UUID;
    cocinero_id UUID;
    mesa_1 UUID;
    mesa_2 UUID;
    mesa_3 UUID;
    ord_id UUID;
BEGIN
    SELECT id INTO ent_id FROM categorias WHERE nombre = 'Entradas';
    SELECT id INTO pla_id FROM categorias WHERE nombre = 'Platos Fuertes';
    SELECT id INTO beb_id FROM categorias WHERE nombre = 'Bebidas';
    SELECT id INTO pos_id FROM categorias WHERE nombre = 'Postres';

    SELECT id INTO admin_id FROM usuarios WHERE rol = 'admin';
    SELECT id INTO mesero_id FROM usuarios WHERE rol = 'mesero';
    SELECT id INTO cocinero_id FROM usuarios WHERE rol = 'cocinero';

    -- Tables
    INSERT INTO mesas (numero, capacidad, estado) VALUES (1, 4, 'libre') RETURNING id INTO mesa_1;
    INSERT INTO mesas (numero, capacidad, estado) VALUES (2, 2, 'ocupada') RETURNING id INTO mesa_2;
    INSERT INTO mesas (numero, capacidad, estado) VALUES (3, 6, 'libre') RETURNING id INTO mesa_3;
    INSERT INTO mesas (numero, capacidad, estado) VALUES (4, 4, 'libre');
    INSERT INTO mesas (numero, capacidad, estado) VALUES (5, 4, 'libre');
    INSERT INTO mesas (numero, capacidad, estado) VALUES (6, 2, 'libre');

    -- Products
    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Tacos de Canasta', 85, 25, ent_id, 'Tortillas de maíz recién hechas rellenas de guisos tradicionales.', 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 45, 10);

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Guacamole Tradicional', 120, 35, ent_id, 'Aguacate fresco machacado con pico de gallo y un toque de lima.', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 30, 5);

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Enchiladas Suizas', 185, 55, pla_id, 'Clásicas tortillas bañadas en salsa verde con crema y queso gratinado.', 'https://images.unsplash.com/photo-1533777324565-a04c1053c12a?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 25, 5);

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Tacos al Pastor', 150, 45, pla_id, 'Adobado tradicional con piña frita, cilantro y cebolla blanca.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 100, 20);

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Agua de Jamaica', 45, 10, beb_id, 'Refrescante infusión de flor de jamaica 100% natural.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 200, 50);

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) 
    VALUES ('Churros con Chocolate', 75, 20, pos_id, 'Fritos al momento, espolvoreados con canela y azúcar.', 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=400')
    RETURNING id INTO prod_id;
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES (prod_id, 60, 15);

    -- 3 Orders Samples
    -- 1. PENDIENTE (For Kitchen)
    INSERT INTO ordenes (mesa_id, mesero_id, total, estado) VALUES (mesa_1, mesero_id, 370, 'pendiente') RETURNING id INTO ord_id;
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) 
    SELECT ord_id, id, 2, precio FROM productos WHERE nombre = 'Enchiladas Suizas';

    -- 2. LISTO (For Waiter)
    INSERT INTO ordenes (mesa_id, mesero_id, total, estado) VALUES (mesa_2, mesero_id, 130, 'listo') RETURNING id INTO ord_id;
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) 
    SELECT ord_id, id, 1, precio FROM productos WHERE nombre = 'Tacos al Pastor';

    -- 3. PAGADO (For Admin Stats)
    INSERT INTO ordenes (mesa_id, mesero_id, total, estado) VALUES (mesa_3, mesero_id, 120, 'pagado') RETURNING id INTO ord_id;
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) 
    SELECT ord_id, id, 1, precio FROM productos WHERE nombre = 'Guacamole Tradicional';

END $$;

-- 5. RLS POLICIES (Simplificadas para el Demo)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_orden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON productos FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON categorias FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON mesas FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON ordenes FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON detalles_orden FOR SELECT USING (true);

-- Allow all for simplicity in demo roles
CREATE POLICY "Full Access for Authenticated" ON productos FOR ALL USING (true);
CREATE POLICY "Full Access for Authenticated" ON categorias FOR ALL USING (true);
CREATE POLICY "Full Access for Authenticated" ON mesas FOR ALL USING (true);
CREATE POLICY "Full Access for Authenticated" ON ordenes FOR ALL USING (true);
CREATE POLICY "Full Access for Authenticated" ON detalles_orden FOR ALL USING (true);
