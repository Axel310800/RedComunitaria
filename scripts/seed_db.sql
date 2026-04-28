-- ============================================
-- SCRIPT DE DATOS DE PRUEBA
-- Insertar datos iniciales para testing
-- ============================================

USE redcomunitaria;

-- ============================================
-- Insertar Usuarios de Prueba
-- ============================================
INSERT INTO usuarios (email, nombre, password_hash, rol) VALUES
('admin@redcomunitaria.pe', 'Admin RedComunitaria', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVgqDDm', 'admin'),
('donante1@email.com', 'Juan Pérez', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVgqDDm', 'donante'),
('donante2@email.com', 'María González', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVgqDDm', 'donante'),
('responsable1@email.com', 'Carlos Flores', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUVgqDDm', 'responsable');
-- ============================================
-- Insertar Ollas Comunes
-- ============================================
INSERT INTO ollas_comunes (nombre, responsable, ubicacion, direccion, numero_beneficiarios, prioridad, estado) VALUES
('Olla Común Los Jardines', 'María González', 'San Juan de Lurigancho', 'Av. Los Jardines 456, Mz. A, Lt. 5', 120, 'ALTA', 'VALIDADA'),
('Olla Común Villa María', 'Carmen Pérez', 'Villa María del Triunfo', 'Av. Principal s/n, Villa María', 85, 'MEDIA', 'VALIDADA'),
('Olla Común Esperanza', 'Rosa Flores', 'San Juan de Miraflores', 'Jr. Esperanza 123, Bloque B', 150, 'ALTA', 'VALIDADA'),
('Olla Común Unión y Fuerza', 'Juan Ramírez', 'Ate Vitarte', 'Calle Unidos 789, Zona 4', 95, 'MEDIA', 'PENDIENTE'),
('Olla Común Solidaridad', 'Ana López', 'Comas', 'Av. Comas 234, Sect. 7', 110, 'BAJA', 'VALIDADA'),
('Olla Común Nueva Esperanza', 'Pedro Rodríguez', 'Los Olivos', 'Jr. Nueva 567, Mz. C', 130, 'MEDIA', 'VALIDADA');

-- ============================================
-- Insertar Necesidades
-- ============================================
INSERT INTO necesidades (olla_id, tipo_necesidad, descripcion, prioridad) VALUES
(1, 'Arroz', 'Arroz blanco 5kg', 'ALTA'),
(1, 'Aceite', 'Aceite vegetal para cocinar', 'ALTA'),
(1, 'Menestras', 'Lentejas, garbanzos, frijoles', 'MEDIA'),
(2, 'Pollo', 'Pollo deshuesado congelado', 'ALTA'),
(2, 'Verduras', 'Verduras frescas variadas', 'MEDIA'),
(3, 'Leche', 'Leche en polvo o fluida', 'ALTA'),
(3, 'Pan', 'Pan de molde o francés', 'MEDIA'),
(4, 'Productos de Higiene', 'Jabón, detergente, pasta dental', 'MEDIA'),
(5, 'Enlatados', 'Conservas variadas', 'BAJA'),
(6, 'Azúcar', 'Azúcar blanca', 'MEDIA');

-- ============================================
-- Insertar Stocks Disponibles
-- ============================================
INSERT INTO stocks_disponibles (olla_id, tipo_recurso, cantidad_kg) VALUES
(1, 'Arroz', 150.50),
(1, 'Aceite', 45.00),
(1, 'Menestras', 78.25),
(2, 'Pollo', 95.00),
(2, 'Verduras', 120.75),
(3, 'Leche', 200.00),
(3, 'Pan', 85.50),
(4, 'Productos de Higiene', 60.00),
(5, 'Enlatados', 110.00),
(6, 'Azúcar', 90.00);

-- ============================================
-- Insertar Beneficiarios
-- ============================================
INSERT INTO beneficiarios (olla_id, nombre_familia, tamaño_familia, necesidades_especiales) VALUES
(1, 'Familia Ramírez', 5, 'Niños menores de 5 años'),
(1, 'Familia Torres', 4, 'Adulto mayor con diabetes'),
(1, 'Familia Mendoza', 6, 'Ninguna'),
(2, 'Familia Gutiérrez', 3, 'Alergia al maní'),
(2, 'Familia Sánchez', 7, 'Embarazo'),
(3, 'Familia López', 5, 'Ninguna'),
(3, 'Familia Hernández', 4, 'Lactancia materna'),
(4, 'Familia Vega', 8, 'Discapacidad'),
(5, 'Familia Rojas', 3, 'Ninguna'),
(6, 'Familia Medina', 6, 'Enfermedad crónica');

-- ============================================
-- Insertar Donaciones
-- ============================================
INSERT INTO donaciones (donante_nombre, donante_email, donante_telefono, tipo_recurso, cantidad_kg, olla_destino_id, estado) VALUES
('Empresa ABC S.A.', 'empresa@abc.com', '987654321', 'Arroz', 50, 1, 'ENTREGADA'),
('Juan Pérez', 'juan@email.com', '999888777', 'Aceite', 20, 1, 'ENTREGADA'),
('María González', 'maria@email.com', '999777666', 'Menestras', 30, 2, 'EN_TRÁNSITO'),
('Tienda XYZ', 'tienda@xyz.com', '987654000', 'Pollo', 45, 2, 'PENDIENTE'),
('Fundación Solidaria', 'fundacion@solidaria.pe', '912345678', 'Leche', 100, 3, 'ENTREGADA'),
('Carlos López', 'carlos@email.com', '999111222', 'Verduras', 60, 3, 'ENTREGADA'),
('Ana Rodríguez', 'ana@email.com', '998765432', 'Pan', 40, 4, 'EN_TRÁNSITO'),
('Distribuidora Nacional', 'distribuidora@nacional.com', '913579246', 'Productos de Higiene', 35, 5, 'PENDIENTE');

-- ============================================
-- Insertar Registros de Distribución
-- ============================================
INSERT INTO distribucion_log (olla_id, beneficiario_id, tipo_recurso, cantidad_kg) VALUES
(1, 1, 'Arroz', 10.00),
(1, 2, 'Arroz', 8.50),
(1, 3, 'Menestras', 5.25),
(2, 4, 'Pollo', 8.00),
(2, 5, 'Verduras', 12.50),
(3, 6, 'Leche', 25.00),
(3, 7, 'Pan', 15.00),
(4, 8, 'Productos de Higiene', 5.00);

-- ============================================
-- Verificar datos insertados
-- ============================================
SELECT 'Total de Usuarios:' AS estadística, COUNT(*) AS cantidad FROM usuarios
UNION ALL
SELECT 'Total de Ollas Comunes', COUNT(*) FROM ollas_comunes
UNION ALL
SELECT 'Total de Beneficiarios', COUNT(*) FROM beneficiarios
UNION ALL
SELECT 'Total de Donaciones', COUNT(*) FROM donaciones
UNION ALL
SELECT 'Total de Registros de Distribución', COUNT(*) FROM distribucion_log;

-- ============================================
-- FIN DE SCRIPT DE DATOS
-- ============================================
