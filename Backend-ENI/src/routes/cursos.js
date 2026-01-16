import express from "express";
import { Curso } from "../database/models/cursos.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// GET /api/cursos - Obtener todos los cursos (sin autenticación requerida)
router.get("/", async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      order: [['created_at', 'DESC']],
      attributes: ['id', 'nombre', 'descripcion', 'duracion', 'categoria', 'nivel', 'created_at', 'updated_at']
    });

    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

// POST /api/cursos - Crear nuevo curso (requiere admin)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, duracion, categoria, nivel } = req.body;

    // Validaciones
    if (!nombre || !descripcion || !duracion || !categoria || !nivel) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        code: "MISSING_FIELDS"
      });
    }

    if (typeof duracion !== 'number' || duracion < 1) {
      return res.status(400).json({
        error: "La duración debe ser un número mayor a 0",
        code: "INVALID_DURATION"
      });
    }

    if (nombre.length > 255) {
      return res.status(400).json({
        error: "El nombre no puede exceder 255 caracteres",
        code: "NAME_TOO_LONG"
      });
    }

    const categoriasValidas = ['Programación', 'Idiomas', 'Matemáticas', 'Ciencias', 'Negocios', 'Arte', 'Otro'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        error: "Categoría inválida",
        code: "INVALID_CATEGORY"
      });
    }

    const nivelesValidos = ['Básico', 'Intermedio', 'Avanzado'];
    if (!nivelesValidos.includes(nivel)) {
      return res.status(400).json({
        error: "Nivel inválido",
        code: "INVALID_LEVEL"
      });
    }

    const nuevoCurso = await Curso.create({
      nombre,
      descripcion,
      duracion,
      categoria,
      nivel
    });

    res.status(201).json({
      id: nuevoCurso.id,
      nombre: nuevoCurso.nombre,
      descripcion: nuevoCurso.descripcion,
      duracion: nuevoCurso.duracion,
      categoria: nuevoCurso.categoria,
      nivel: nuevoCurso.nivel,
      created_at: nuevoCurso.created_at,
      updated_at: nuevoCurso.updated_at
    });

  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

// PUT /api/cursos/{id} - Actualizar curso (requiere admin)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion, categoria, nivel } = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({
        error: "Curso no encontrado",
        code: "COURSE_NOT_FOUND"
      });
    }

    // Validaciones opcionales (solo si se proporcionan)
    const updateData = {};

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || nombre.trim().length === 0 || nombre.length > 255) {
        return res.status(400).json({
          error: "Nombre inválido",
          code: "INVALID_NAME"
        });
      }
      updateData.nombre = nombre.trim();
    }

    if (descripcion !== undefined) {
      if (typeof descripcion !== 'string' || descripcion.trim().length === 0) {
        return res.status(400).json({
          error: "Descripción inválida",
          code: "INVALID_DESCRIPTION"
        });
      }
      updateData.descripcion = descripcion.trim();
    }

    if (duracion !== undefined) {
      if (typeof duracion !== 'number' || duracion < 1) {
        return res.status(400).json({
          error: "Duración inválida",
          code: "INVALID_DURATION"
        });
      }
      updateData.duracion = duracion;
    }

    if (categoria !== undefined) {
      const categoriasValidas = ['Programación', 'Idiomas', 'Matemáticas', 'Ciencias', 'Negocios', 'Arte', 'Otro'];
      if (!categoriasValidas.includes(categoria)) {
        return res.status(400).json({
          error: "Categoría inválida",
          code: "INVALID_CATEGORY"
        });
      }
      updateData.categoria = categoria;
    }

    if (nivel !== undefined) {
      const nivelesValidos = ['Básico', 'Intermedio', 'Avanzado'];
      if (!nivelesValidos.includes(nivel)) {
        return res.status(400).json({
          error: "Nivel inválido",
          code: "INVALID_LEVEL"
        });
      }
      updateData.nivel = nivel;
    }

    // Actualizar timestamps
    updateData.updated_at = new Date();

    await curso.update(updateData);

    res.json({
      id: curso.id,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      duracion: curso.duracion,
      categoria: curso.categoria,
      nivel: curso.nivel,
      updated_at: curso.updated_at
    });

  } catch (error) {
    console.error("Error al actualizar curso:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

// DELETE /api/cursos/{id} - Eliminar curso (requiere admin)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({
        error: "Curso no encontrado",
        code: "COURSE_NOT_FOUND"
      });
    }

    await curso.destroy();

    res.json({
      message: "Curso eliminado exitosamente",
      id: parseInt(id)
    });

  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

export default router;