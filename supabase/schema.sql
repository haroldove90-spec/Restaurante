-- Restaurante Pro: Esquema Completo Avanzado
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT CHECK (rol IN ('admin', 'mesero', 'cocinero', 'cajero')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT NOT NULL UNIQUE,
  capacidad INTEGER DEFAULT 4,
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'por_pagar', 'mantenimiento')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ordenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mesa_id UUID REFERENCES mesas(id),
  mesero_id UUID REFERENCES usuarios(id),
  total NUMERIC(10,2) DEFAULT 0,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'servido', 'pagado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE detalles_orden (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id UUID REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) UNIQUE,
  stock_actual NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_minimo NUMERIC(10,2) NOT NULL DEFAULT 5,
  unidad_medida TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRIGGER PARA ACTUALIZAR STOCK
CREATE OR REPLACE FUNCTION disminuir_stock_orden() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventario 
  SET stock_actual = stock_actual - NEW.cantidad
  WHERE producto_id = NEW.producto_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_disminuir_stock
AFTER INSERT ON detalles_orden
FOR EACH ROW
EXECUTE FUNCTION disminuir_stock_orden();

-- SEED DATA
INSERT INTO categorias (nombre) VALUES ('Entradas'), ('Platos Fuertes'), ('Bebidas'), ('Postres');

DO $$
DECLARE
  cat_entrada UUID;
  cat_fuerte UUID;
  cat_bebida UUID;
  cat_postre UUID;
BEGIN
  SELECT id INTO cat_entrada FROM categorias WHERE nombre = 'Entradas';
  SELECT id INTO cat_fuerte FROM categorias WHERE nombre = 'Platos Fuertes';
  SELECT id INTO cat_bebida FROM categorias WHERE nombre = 'Bebidas';
  SELECT id INTO cat_postre FROM categorias WHERE nombre = 'Postres';

  INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES
    ('Guacamole Tradicional', 'Aguacate fresco con pico de gallo', 8.50, cat_entrada),
    ('Tacos al Pastor (3)', 'Cerdo marinado con piña', 12.00, cat_fuerte),
    ('Chilaquiles Verdes', 'Totopos con salsa verde y pollo', 10.50, cat_fuerte),
    ('Enchiladas Suizas', 'Rellenas de pollo con salsa cremosa', 13.00, cat_fuerte),
    (' Hamburguesa Pro', 'Carne 200g, queso cheddar y tocino', 15.00, cat_fuerte),
    ('Ceviche de Pescado', 'Marinado en limón y especias', 14.50, cat_fuerte),
    ('Margarita Classic', 'Tequila, triple sec y limón', 9.00, cat_bebida),
    ('Cerveza Artesanal', 'IPA de la casa', 6.50, cat_bebida),
    ('Tiramisú', 'Café, mascarpone y cacao', 7.50, cat_postre),
    ('Flan Casero', 'Con caramelo suave', 5.50, cat_postre);
END $$;

INSERT INTO mesas (numero, capacidad) VALUES 
  ('Mesa 1', 2), ('Mesa 2', 4), ('Mesa 3', 4), ('Mesa 4', 6), ('Mesa 5', 8);

INSERT INTO inventario (producto_id, stock_actual, stock_minimo, unidad_medida)
SELECT id, 100, 10, 'unidades' FROM productos;
