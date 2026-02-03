-- ==============================================================
-- Script de verificación y corrección de esquema para ENI-360
-- ==============================================================
-- Ejecuta este script en tu base de datos MySQL para:
-- 1. Verificar que la tabla 'archivos' existe
-- 2. Verificar que la columna 'archivos' existe en 'notificaciones'
-- 3. Crear o agregar columnas si es necesario

-- PASO 1: Verificar tabla 'archivos'
-- ============================================================
-- Ejecutar: SHOW TABLES LIKE 'archivos';
-- Si no existe, deberás ejecutar las migraciones de Sequelize

-- PASO 2: Ver estructura de tabla 'notificaciones'
DESCRIBE notificaciones;

-- PASO 3: Verificar si existe la columna 'archivos'
-- Si la siguiente consulta devuelve 0 resultados, necesitas agregar la columna
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'notificaciones' 
AND COLUMN_NAME IN ('archivos', 'archivo')
AND TABLE_SCHEMA = DATABASE();

-- PASO 4: Si no existe la columna 'archivos', ejecuta esto:
-- ============================================================
-- OPCIÓN A: Agregar columna 'archivos' si no existe
ALTER TABLE notificaciones 
ADD COLUMN archivos LONGTEXT NULL DEFAULT NULL 
COMMENT 'JSON array de rutas de archivos adjuntos';

-- OPCIÓN B: Si quieres renombrar 'archivo' a 'archivos' (más riesgoso):
-- ALTER TABLE notificaciones CHANGE COLUMN archivo archivos LONGTEXT NULL;

-- PASO 5: Verificar que los cambios se aplicaron
DESCRIBE notificaciones;

-- PASO 6: Ver algunas notificaciones para verificar estado
SELECT id, usuarioId, asunto, createdAt, archivos 
FROM notificaciones 
ORDER BY createdAt DESC 
LIMIT 5;

-- PASO 7: Ver archivos recientes
SELECT id, usuarioId, nombre, ruta, estado, fechaCarga 
FROM archivos 
ORDER BY fechaCarga DESC 
LIMIT 5;

-- PASO 8: Verificar que la tabla archivos existe y tiene datos
SELECT 
    (SELECT COUNT(*) FROM archivos) as total_archivos,
    (SELECT COUNT(*) FROM notificaciones) as total_notificaciones,
    (SELECT COUNT(*) FROM usuarios WHERE rol = 'Administrador') as administradores;

-- ==============================================================
-- Notas importantes:
-- ==============================================================
-- 1. Si 'archivos' es NULL para nuevas notificaciones, la columna puede no existir
-- 2. Si 'archivos' es TEXT/LONGTEXT pero está vacío, el insert fallaba silenciosamente
-- 3. La columna debe ser LONGTEXT o MEDIUMTEXT para almacenar JSON arrays grandes
-- 4. Después de agregar la columna, reinicia el servidor backend
-- 5. Vuelve a intentar subir una evidencia y verifica que se creen registros en ambas tablas
