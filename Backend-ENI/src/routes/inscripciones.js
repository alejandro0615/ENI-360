import express from "express";
import { Inscripcion } from "../database/models/inscripciones.js";
import { Curso } from "../database/models/cursos.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/inscripciones - Inscribirse a un curso (requiere autenticación)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { curso_id } = req.body;
    const usuario_id = req.usuario.id;

    // Validaciones
    if (!curso_id || typeof curso_id !== 'number') {
      return res.status(400).json({
        error: "ID del curso es requerido y debe ser un número",
        code: "INVALID_COURSE_ID"
      });
    }

    // Verificar que el curso existe
    const curso = await Curso.findByPk(curso_id);
    if (!curso) {
      return res.status(404).json({
        error: "Curso no encontrado",
        code: "COURSE_NOT_FOUND"
      });
    }

    // Verificar que el usuario no esté ya inscrito
    const inscripcionExistente = await Inscripcion.findOne({
      where: {
        usuario_id,
        curso_id
      }
    });

    if (inscripcionExistente) {
      return res.status(409).json({
        error: "Ya estás inscrito en este curso",
        code: "ALREADY_ENROLLED"
      });
    }

    // Crear la inscripción
    const nuevaInscripcion = await Inscripcion.create({
      usuario_id,
      curso_id,
      estado: 'activo'
    });

    res.status(201).json({
      id: nuevaInscripcion.id,
      usuario_id: nuevaInscripcion.usuario_id,
      curso_id: nuevaInscripcion.curso_id,
      fecha_inscripcion: nuevaInscripcion.fecha_inscripcion,
      estado: nuevaInscripcion.estado
    });

  } catch (error) {
    console.error("Error al crear inscripción:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

// GET /api/inscripciones/usuario - Obtener inscripciones del usuario autenticado
router.get("/usuario", verifyToken, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const inscripciones = await Inscripcion.findAll({
      where: { usuario_id },
      include: [{
        model: Curso,
        as: 'curso',
        attributes: ['id', 'nombre', 'descripcion', 'duracion', 'categoria', 'nivel']
      }],
      order: [['fecha_inscripcion', 'DESC']],
      attributes: ['id', 'usuario_id', 'curso_id', 'fecha_inscripcion', 'estado']
    });

    // Formatear respuesta
    const resultado = inscripciones.map(inscripcion => ({
      id: inscripcion.id,
      usuario_id: inscripcion.usuario_id,
      curso_id: inscripcion.curso_id,
      fecha_inscripcion: inscripcion.fecha_inscripcion,
      estado: inscripcion.estado,
      curso: inscripcion.curso ? {
        id: inscripcion.curso.id,
        nombre: inscripcion.curso.nombre,
        descripcion: inscripcion.curso.descripcion,
        duracion: inscripcion.curso.duracion,
        categoria: inscripcion.curso.categoria,
        nivel: inscripcion.curso.nivel
      } : null
    }));

    res.json(resultado);

  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      code: "INTERNAL_ERROR"
    });
  }
});

export default router;