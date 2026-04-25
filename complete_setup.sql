-- FULL DATABASE SETUP FOR RESTAURANT PRO
-- Copy and run this script in the Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('admin', 'mesero', 'cocinero', 'cajero', 'cliente')),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    costo DECIMAL(10,2) DEFAULT 0,
    categoria_id UUID REFERENCES categorias(id),
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 10,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mesas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero INTEGER UNIQUE NOT NULL,
    capacidad INTEGER NOT NULL,
    estado TEXT DEFAULT 'libre' CHECK (estado IN ('libre', 'ocupada', 'reservada'))
);

CREATE TABLE IF NOT EXISTS ordenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mesa_id UUID REFERENCES mesas(id),
    usuario_id UUID REFERENCES usuarios(id),
    total DECIMAL(10,2) DEFAULT 0,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'pagado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalles_orden (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL
);

-- 3. INITIAL DATA
TRUNCATE detalles_orden, ordenes, inventario, productos, categorias, mesas, usuarios RESTART IDENTITY CASCADE;

INSERT INTO usuarios (email, nombre, rol) VALUES
('admin@cossma.com.mx', 'Administrador General', 'admin'),
('mesero@cossma.com.mx', 'Juan Mesero', 'mesero'),
('cocinero@cossma.com.mx', 'Chef Executivo', 'cocinero'),
('invitado@cossma.com.mx', 'Cliente Invitado', 'cliente');

INSERT INTO categorias (nombre) VALUES
('Entradas'),
('Platos Fuertes'),
('Bebidas'),
('Postres');

DO $$ 
DECLARE 
    ent_id UUID;
    pla_id UUID;
    beb_id UUID;
    pos_id UUID;
BEGIN
    SELECT id INTO ent_id FROM categorias WHERE nombre = 'Entradas';
    SELECT id INTO pla_id FROM categorias WHERE nombre = 'Platos Fuertes';
    SELECT id INTO beb_id FROM categorias WHERE nombre = 'Bebidas';
    SELECT id INTO pos_id FROM categorias WHERE nombre = 'Postres';

    INSERT INTO productos (nombre, precio, costo, categoria_id, descripcion, imagen_url) VALUES 
    ('Tacos de Canasta', 85, 25, ent_id, 'Tortillas de maíz recién hechas rellenas de guisos tradicionales.', 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=400'),
    ('Guacamole Tradicional', 120, 35, ent_id, 'Aguacate fresco machacado con pico de gallo y un toque de lima.', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400'),
    ('Enchiladas Suizas', 185, 55, pla_id, 'Clásicas tortillas bañadas en salsa verde con crema y queso gratinado.', 'https://images.unsplash.com/photo-1533777324565-a04c1053c12a?q=80&w=400'),
    ('Tacos al Pastor', 150, 45, pla_id, 'Adobado tradicional con piña frita, cilantro y cebolla blanca.', 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400'),
    ('Agua de Jamaica', 45, 10, beb_id, 'Refrescante infusión de flor de jamaica 100% natural.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400'),
    ('Churros con Chocolate', 75, 20, pos_id, 'Fritos al momento, espolvoreados con canela y azúcar.', 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=400');

    INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
    SELECT id, 50, 10 FROM productos;
END $$;

INSERT INTO mesas (numero, capacidad, estado) VALUES
(1, 4, 'libre'),
(2, 4, 'ocupada'),
(3, 2, 'libre'),
(4, 2, 'reservada');
