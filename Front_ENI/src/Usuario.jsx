import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Usuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Recupera datos guardados del usuario
    const datosUsuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!token || !datosUsuario) {
      navigate("/login"); // si no está logueado, redirige
    } else {
      setUsuario(datosUsuario);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div className="usuario-container">
      <header className="usuario-header">
        <h2>Bienvenido, {usuario.nombre}, {usuario.rol} 👋</h2>
        <button onClick={() => navigate("/mis-notificaciones")}>Ver todas mis notificaciones</button>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      <main className="usuario-main">
        <h3>Tus cursos</h3>
        <p>Aquí aparecerán tus cursos y notificaciones personalizadas 📚</p>
      </main>
    </div>
  );
}
