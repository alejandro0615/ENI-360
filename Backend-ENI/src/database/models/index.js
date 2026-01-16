import { Usuario } from "./usuarios.js";
import { Area } from "./area.js";
import { Curso } from "./cursos.js";
import { Inscripcion } from "./inscripciones.js";

// --- RELACIÓN 1 (Área) a MUCHOS (Instructores/Usuarios) ---
Area.hasMany(Usuario, { foreignKey: "areaId", as: "instructores" });
Usuario.belongsTo(Area, { foreignKey: "areaId", as: "area" });

export { Usuario, Area, Curso, Inscripcion };
