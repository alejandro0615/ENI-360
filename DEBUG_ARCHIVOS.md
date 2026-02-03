# 🔍 Guía de Debug - Sistema de Archivos ENI-360

## Problema Actual
✅ Upload muestra "éxito"
❌ Tabla `archivos` vacía
❌ Notificaciones no llegan a administradores

## Solución Implementada

### ✅ Cambios en Backend-ENI/src/routes/usuarios.js

1. **Agregué import**: `import { Archivo } from "../database/models/archivos.js";`
2. **Reescribí ruta `/subir-evidencia`** para:
   - ✅ Crear registros en tabla `archivos` PRIMERO
   - ✅ Luego crear notificaciones para administradores
   - ✅ Agregar logs detallados en cada paso
   - ✅ Devolver información sobre registros creados

### 📋 Pasos para Verificar

#### PASO 1: Ejecutar consulta SQL de verificación
```bash
# Abrir MySQL/PhpMyAdmin y ejecutar:
DESCRIBE notificaciones;
```

Buscar si existe columna `archivos`. Si no existe, ejecutar en MySQL:

```sql
ALTER TABLE notificaciones 
ADD COLUMN archivos LONGTEXT NULL DEFAULT NULL 
COMMENT 'JSON array de rutas de archivos adjuntos';
```

Ver archivo: `VERIFICAR_SCHEMA.sql` en raíz de Backend-ENI

#### PASO 2: Reiniciar servidor backend
```bash
# En terminal Backend-ENI:
npm start
# O si usas nodemon:
npm run dev
```

#### PASO 3: Observar logs en terminal
Cuando subas una evidencia, deberías ver logs como:

```
[SUBIR-EVIDENCIA] Usuario 5 subiendo 1 archivo(s)
[SUBIR-EVIDENCIA] Creando 1 registros en tabla archivos...
[SUBIR-EVIDENCIA] ✓ 1 registros creados en archivos
[SUBIR-EVIDENCIA] Encontrados 3 administrador(es)
[SUBIR-EVIDENCIA] Columnas en notificaciones: [...]
[SUBIR-EVIDENCIA] Usando columna 'archivos' para guardar rutas
[SUBIR-EVIDENCIA] ✓ 3 notificaciones creadas
```

Si ves error en cualquier paso, copiar el error completo.

#### PASO 4: Subir una evidencia de prueba
1. Ir a "Subir Evidencias" en Frontend
2. Seleccionar un PDF
3. Escribir descripción
4. Click "Subir"
5. **Esperar a que aparezca el mensaje de éxito**

#### PASO 5: Verificar en base de datos
```sql
-- Ver archivos recientes
SELECT id, usuarioId, nombre, ruta, estado, fechaCarga 
FROM archivos 
ORDER BY fechaCarga DESC 
LIMIT 5;

-- Ver notificaciones recientes
SELECT id, usuarioId, asunto, archivos, createdAt 
FROM notificaciones 
ORDER BY createdAt DESC 
LIMIT 5;
```

Si ves datos aquí = **¡PROBLEMA RESUELTO!** ✅

Si ves NULL o filas vacías = **Ver Troubleshooting abajo**

---

## 🐛 Troubleshooting

### Síntoma 1: Error "Unknown column 'archivos'"
**Causa**: Columna `archivos` no existe en tabla `notificaciones`

**Solución**:
```sql
ALTER TABLE notificaciones 
ADD COLUMN archivos LONGTEXT NULL;
```

### Síntoma 2: Tabla `archivos` vacía pero recibe success
**Causa**: `Archivo.bulkCreate()` está fallando silenciosamente (no fue capturado en try-catch anterior)

**Verificación**:
1. Ver logs en terminal cuando subes evidencia
2. Si ves error en logs → copiar y enviar
3. Si NO ves logs → es posible que multer falle antes

### Síntoma 3: Notificaciones vacías / sin archivos
**Causa**: Columna `archivos` no existe en tabla `notificaciones`

**Solución**: Ejecutar comando SQL del Síntoma 1

### Síntoma 4: No ves logs en terminal
**Posible Causa**: 
- Backend no reiniciado después del cambio
- Estás usando terminal distinta
- Logs no se muestran por filtros

**Solución**:
```bash
# CTRL+C para detener
# Luego:
npm start
```

---

## 📊 Flujo Esperado Después de Fix

```
Usuario sube PDF
    ↓
Multer recibe archivo
    ↓
✅ Crea registro en tabla 'archivos' 
    ↓
✅ Obtiene administradores
    ↓
✅ Crea notificaciones para cada admin
    ↓
✅ Devuelve success con contador
    ↓
Frontend muestra: "✅ Evidencia subida correctamente. 
                   Archivos creados: 1. Notificaciones: 3"
```

---

## 📝 Comandos Útiles MySQL

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Estructura archivos
DESCRIBE archivos;

-- Estructura notificaciones
DESCRIBE notificaciones;

-- Contar registros
SELECT COUNT(*) FROM archivos;
SELECT COUNT(*) FROM notificaciones;

-- Ver últimos archivos
SELECT * FROM archivos ORDER BY fechaCarga DESC LIMIT 3;

-- Ver últimas notificaciones
SELECT id, usuarioId, asunto, archivos FROM notificaciones ORDER BY createdAt DESC LIMIT 3;

-- Limpiar tablas de prueba (si es necesario)
DELETE FROM archivos WHERE fechaCarga > DATE_SUB(NOW(), INTERVAL 1 HOUR);
DELETE FROM notificaciones WHERE createdAt > DATE_SUB(NOW(), INTERVAL 1 HOUR);
```

---

## ✅ Checklist Completo

- [ ] Ejecuté `DESCRIBE notificaciones` en MySQL
- [ ] Verifiqué que existe columna `archivos`
- [ ] Si no existe, ejecuté ALTER TABLE para agregarla
- [ ] Reinicié servidor backend (`npm start`)
- [ ] Subí una evidencia de prueba
- [ ] Vi los logs con "[SUBIR-EVIDENCIA]" en terminal
- [ ] Ejecuté SELECT en tabla `archivos` y vi el registro
- [ ] Ejecuté SELECT en tabla `notificaciones` y vi la notificación
- [ ] Campo `archivos` contiene JSON con la ruta del archivo
- [ ] ✅ PROBLEMA RESUELTO!

