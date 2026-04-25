-- LIMPIEZA DE TABLAS
TRUNCATE detalles_orden, ordenes, inventario, productos, categorias, mesas, usuarios RESTART IDENTITY CASCADE;

-- USUARIOS POR ROL
INSERT INTO usuarios (email, nombre, rol) VALUES
('admin@cossma.com.mx', 'Administrador General', 'admin'),
('mesero@cossma.com.mx', 'Juan Mesero', 'mesero'),
('cocinero@cossma.com.mx', 'Chef Executivo', 'cocinero');

-- CATEGORÍAS
INSERT INTO categorias (nombre) VALUES
('Entradas'),
('Platos Fuertes'),
('Bebidas'),
('Postres');

-- PRODUCTOS (12 unidades)
-- Obtenemos IDs de categorías insertadas para mantener consistencia
DO $$ 
DECLARE 
    ent_id UUID;
    pla_id UUID;
    beb_id UUID;
    pos_id UUID;
    prod_id UUID;
BEGIN
    SELECT id INTO ent_id FROM categorias WHERE nombre = 'Entradas';
    SELECT id INTO pla_id FROM categorias WHERE nombre = 'Platos Fuertes';
    SELECT id INTO beb_id FROM categorias WHERE nombre = 'Bebidas';
    SELECT id INTO pos_id FROM categorias WHERE nombre = 'Postres';

    -- ENTRADAS
    INSERT INTO productos (nombre, precio, costo, categoria_id) VALUES 
    ('Tacos de Canasta', 85, 25, ent_id),
    ('Guacamole Tradicional', 120, 35, ent_id),
    ('Sopa de Lima', 95, 30, ent_id);

    -- PLATOS FUERTES
    INSERT INTO productos (nombre, precio, costo, categoria_id) VALUES 
    ('Enchiladas Suizas', 185, 55, pla_id),
    ('Tacos al Pastor', 150, 45, pla_id),
    ('Mole Poblano', 220, 70, pla_id);

    -- BEBIDAS
    INSERT INTO productos (nombre, precio, costo, categoria_id) VALUES 
    ('Margarita Classic', 110, 30, beb_id),
    ('Agua de Jamaica', 45, 10, beb_id),
    ('Cerveza Artesana', 85, 35, beb_id);

    -- POSTRES
    INSERT INTO productos (nombre, precio, costo, categoria_id) VALUES 
    ('Churros con Chocolate', 75, 20, pos_id),
    ('Flan Napolitano', 65, 15, pos_id),
    ('Helado de Vainilla', 55, 12, pos_id);

    -- INVENTARIO INICIAL (Todos los productos con stock 50)
    INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
    SELECT id, 50, 10 FROM productos;
END $$;

-- MESAS (8 unidades)
INSERT INTO mesas (numero, capacidad, estado) VALUES
(1, 4, 'libre'),
(2, 4, 'ocupada'),
(3, 2, 'libre'),
(4, 2, 'reservada'),
(5, 6, 'libre'),
(6, 4, 'ocupada'),
(7, 4, 'libre'),
(8, 2, 'libre');

-- ÓRDENES ACTIVAS (5 unidades)
DO $$ 
DECLARE 
    mesa1 UUID;
    mesa2 UUID;
    user_m UUID;
    prod_en UUID;
    prod_ta UUID;
    ord_id UUID;
BEGIN
    SELECT id INTO mesa1 FROM mesas WHERE numero = 2;
    SELECT id INTO mesa2 FROM mesas WHERE numero = 6;
    SELECT id INTO user_m FROM usuarios WHERE rol = 'mesero';
    SELECT id INTO prod_en FROM productos WHERE nombre = 'Enchiladas Suizas';
    SELECT id INTO prod_ta FROM productos WHERE nombre = 'Tacos al Pastor';

    -- ORDEN 1 (Pendiente)
    INSERT INTO ordenes (mesa_id, usuario_id, estado, total) 
    VALUES (mesa1, user_m, 'pendiente', 335) RETURNING id INTO ord_id;
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES
    (ord_id, prod_en, 1, 185),
    (ord_id, prod_ta, 1, 150);

    -- ORDEN 2 (Preparando)
    INSERT INTO ordenes (mesa_id, usuario_id, estado, total) 
    VALUES (mesa2, user_m, 'preparando', 185) RETURNING id INTO ord_id;
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES
    (ord_id, prod_en, 1, 185);

    -- ORDEN 3 (Pendiente)
    INSERT INTO ordenes (mesa_id, usuario_id, estado, total) 
    VALUES (mesa1, user_m, 'pendiente', 110) RETURNING id INTO ord_id;
    SELECT id INTO prod_ta FROM productos WHERE nombre = 'Margarita Classic';
    INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES
    (ord_id, prod_ta, 1, 110);
END $$;
