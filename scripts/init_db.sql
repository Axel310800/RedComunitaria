-- ============================================
-- Base de Datos: RedComunitaria
-- Sistema de Distribución Equitativa de Recursos
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS redcomunitaria;
USE redcomunitaria;

-- ============================================
-- Tabla: usuarios
-- Descripción: Almacena los usuarios del sistema
-- ============================================
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  contraseña_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'donante', 'voluntario') DEFAULT 'donante',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: ollas_comunes
-- Descripción: Registro de ollas comunes
-- ============================================
CREATE TABLE ollas_comunes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  responsable VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  direccion TEXT NOT NULL,
  numero_beneficiarios INT NOT NULL,
  prioridad ENUM('BAJA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',
  estado ENUM('VALIDADA', 'PENDIENTE') DEFAULT 'PENDIENTE',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE,
  INDEX idx_estado (estado),
  INDEX idx_prioridad (prioridad),
  FULLTEXT INDEX idx_search (nombre, ubicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: necesidades
-- Descripción: Necesidades específicas de cada olla
-- ============================================
CREATE TABLE necesidades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  olla_id INT NOT NULL,
  tipo_necesidad VARCHAR(100) NOT NULL,
  descripcion TEXT,
  prioridad ENUM('BAJA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (olla_id) REFERENCES ollas_comunes(id) ON DELETE CASCADE,
  INDEX idx_olla (olla_id),
  INDEX idx_tipo (tipo_necesidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: stocks_disponibles
-- Descripción: Inventario de recursos en cada olla
-- ============================================
CREATE TABLE stocks_disponibles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  olla_id INT NOT NULL,
  tipo_recurso VARCHAR(100) NOT NULL,
  cantidad_kg DECIMAL(10, 2) NOT NULL,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (olla_id) REFERENCES ollas_comunes(id) ON DELETE CASCADE,
  INDEX idx_olla (olla_id),
  INDEX idx_tipo (tipo_recurso),
  UNIQUE KEY unique_olla_recurso (olla_id, tipo_recurso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: donaciones
-- Descripción: Registro de donaciones realizadas
-- ============================================
CREATE TABLE donaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donante_nombre VARCHAR(255) NOT NULL,
  donante_email VARCHAR(255) NOT NULL,
  donante_telefono VARCHAR(20),
  tipo_recurso VARCHAR(100) NOT NULL,
  cantidad_kg DECIMAL(10, 2) NOT NULL,
  olla_destino_id INT NOT NULL,
  mensaje TEXT,
  estado ENUM('ENTREGADA', 'PENDIENTE', 'EN_TRÁNSITO') DEFAULT 'PENDIENTE',
  fecha_donacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega TIMESTAMP NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (olla_destino_id) REFERENCES ollas_comunes(id),
  INDEX idx_estado (estado),
  INDEX idx_olla_destino (olla_destino_id),
  INDEX idx_fecha_donacion (fecha_donacion),
  FULLTEXT INDEX idx_donante_search (donante_nombre, donante_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: beneficiarios
-- Descripción: Familias beneficiadas por cada olla
-- ============================================
CREATE TABLE beneficiarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  olla_id INT NOT NULL,
  nombre_familia VARCHAR(255) NOT NULL,
  tamaño_familia INT NOT NULL,
  necesidades_especiales TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (olla_id) REFERENCES ollas_comunes(id) ON DELETE CASCADE,
  INDEX idx_olla (olla_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: distribucion_log
-- Descripción: Registro de distribuciones realizadas
-- ============================================
CREATE TABLE distribucion_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  olla_id INT NOT NULL,
  beneficiario_id INT NOT NULL,
  tipo_recurso VARCHAR(100) NOT NULL,
  cantidad_kg DECIMAL(10, 2) NOT NULL,
  fecha_distribucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (olla_id) REFERENCES ollas_comunes(id) ON DELETE CASCADE,
  FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE CASCADE,
  INDEX idx_olla (olla_id),
  INDEX idx_beneficiario (beneficiario_id),
  INDEX idx_fecha (fecha_distribucion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================

-- Índices para búsquedas comunes
CREATE INDEX idx_donaciones_olla_estado ON donaciones(olla_destino_id, estado);
CREATE INDEX idx_necesidades_olla ON necesidades(olla_id, activa);

-- ============================================
-- FIN DE SCRIPT DE INICIALIZACIÓN
-- ============================================
