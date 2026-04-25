-- 1. ADD CUSTOMER ROLE & TEST USER
INSERT INTO usuarios (email, nombre, rol) VALUES
('invitado@cossma.com.mx', 'Cliente Invitado', 'cliente')
ON CONFLICT (email) DO NOTHING;

-- 2. ENRICH PRODUCT DATA (Descriptions & Images)
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

    -- Update existing products with appetizing descriptions and placeholders
    UPDATE productos SET 
        descripcion = 'Tortillas de maíz recién hechas rellenas de guisos tradicionales.',
        imagen_url = 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=400' 
    WHERE nombre = 'Tacos de Canasta';

    UPDATE productos SET 
        descripcion = 'Aguacate fresco machacado con pico de gallo y un toque de lima.',
        imagen_url = 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400' 
    WHERE nombre = 'Guacamole Tradicional';

    UPDATE productos SET 
        descripcion = 'Clásicas tortillas bañadas en salsa verde con crema y queso gratinado.',
        imagen_url = 'https://images.unsplash.com/photo-1533777324565-a04c1053c12a?q=80&w=400' 
    WHERE nombre = 'Enchiladas Suizas';

    UPDATE productos SET 
        descripcion = 'Adobado tradicional con piña frita, cilantro y cebolla blanca.',
        imagen_url = 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=400' 
    WHERE nombre = 'Tacos al Pastor';

    UPDATE productos SET 
        descripcion = 'Refrescante infusión de flor de jamaica 100% natural.',
        imagen_url = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400' 
    WHERE nombre = 'Agua de Jamaica';

    UPDATE productos SET 
        descripcion = 'Fritos al momento, espolvoreados con canela y azúcar.',
        imagen_url = 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?q=80&w=400' 
    WHERE nombre = 'Churros con Chocolate';
END $$;
