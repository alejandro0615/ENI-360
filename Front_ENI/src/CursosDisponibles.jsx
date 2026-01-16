import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetAllCourses from "./services/Cursos/GetAllCourses";
import EnrollCourse from "./services/Inscripciones/EnrollCourse";
import GetUserEnrollments from "./services/Inscripciones/GetUserEnrollments";

export default function CursosDisponibles() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!token || !datosUsuario) {
      navigate("/login");
    } else {
      setUsuario(datosUsuario);
      loadCursos();
      loadUserEnrollments();
    }
  }, [navigate]);

  const loadCursos = async () => {
    try {
      const data = await GetAllCourses();
      setCursos(data);
    } catch (error) {
      console.error("Error cargando cursos:", error);
    }
  };

  const loadUserEnrollments = async () => {
    try {
      const data = await GetUserEnrollments();
      setInscripciones(data);
    } catch (error) {
      console.error("Error cargando inscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await EnrollCourse(courseId);
      alert("¡Te has inscrito exitosamente al curso!");
      loadUserEnrollments(); // Recargar inscripciones
    } catch (error) {
      console.error("Error inscribiéndose al curso:", error);
      alert("Error al inscribirse al curso. Inténtalo de nuevo.");
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId) => {
    return inscripciones.some(inscripcion => inscripcion.curso_id === courseId);
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="cursos-disponibles-container">
      <header className="cursos-disponibles-header">
        <div className="header-top">
          <h2>Cursos Disponibles - {usuario.nombre}</h2>
          <div className="header-buttons">
            <button className="btn-volver" onClick={() => navigate("/usuario")}>
              ← Volver a mi Panel
            </button>
          </div>
        </div>
      </header>

      <main className="cursos-disponibles-main">
        <div className="welcome-section">
          <h3>Explora nuestros cursos disponibles 📚</h3>
          <p>Encuentra el curso perfecto para ti y comienza tu aprendizaje</p>
        </div>

        {loading ? (
          <p className="loading-text">Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <div className="no-cursos">
            <h4>No hay cursos disponibles</h4>
            <p>Contacta con un administrador para que agregue nuevos cursos.</p>
          </div>
        ) : (
          <div className="cursos-grid">
            {cursos.map((curso) => {
              const enrolled = isEnrolled(curso.id);
              return (
                <div key={curso.id} className="curso-card">
                  <div className="curso-header">
                    <h4>{curso.nombre}</h4>
                    <span className={`nivel-badge nivel-${curso.nivel.toLowerCase()}`}>
                      {curso.nivel}
                    </span>
                  </div>

                  <div className="curso-body">
                    <p className="descripcion">{curso.descripcion}</p>
                    <div className="curso-info">
                      <span><strong>Categoría:</strong> {curso.categoria}</span>
                      <span><strong>Duración:</strong> {curso.duracion} horas</span>
                    </div>
                  </div>

                  <div className="curso-actions">
                    {enrolled ? (
                      <div className="enrolled-status">
                        <span className="enrolled-text">✓ Inscrito</span>
                      </div>
                    ) : (
                      <button
                        className="btn-inscribirse"
                        onClick={() => handleEnroll(curso.id)}
                        disabled={enrolling === curso.id}
                      >
                        {enrolling === curso.id ? "Inscribiendo..." : "Inscribirme"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sección de cursos inscritos */}
        {inscripciones.length > 0 && (
          <div className="mis-cursos-section">
            <h3>Mis Cursos Inscritos</h3>
            <div className="inscripciones-list">
              {inscripciones.map((inscripcion) => {
                const curso = cursos.find(c => c.id === inscripcion.curso_id);
                if (!curso) return null;

                return (
                  <div key={inscripcion.id} className="inscripcion-item">
                    <div className="inscripcion-info">
                      <h5>{curso.nombre}</h5>
                      <p>{curso.descripcion}</p>
                      <small>Inscrito el: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}</small>
                    </div>
                    <div className="inscripcion-status">
                      <span className="status-active">Activo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}