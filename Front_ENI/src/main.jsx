import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Principal from "./Principal";
import Registro from "./Register";
import Login from "./Login";
import Usuario from "./Usuario";
import RutaProtegida from "./RutaProtegida";
import Administrador from "./Admin";
import EnviarNotificacionPorArea from "./notificaciones";
import MisNotificaciones from "./MisNotificaciones";
import "./css/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notificaciones" element={<EnviarNotificacionPorArea />} />
        <Route path="/mis-notificaciones" element={<MisNotificaciones />} />


        <Route
          path="/usuario"
          element={
            <RutaProtegida>
              <Usuario />
            </RutaProtegida>
          }
        />

        <Route
          path="/administrador"
          element={
            <RutaProtegida rolRequerido="Administrador">
              <Administrador />
            </RutaProtegida>
          }
        />
        {/* <Route
          path="/notificaciones"
          element={
            <RutaProtegida rolRequerido="Administrador">
              <Notificaciones />
            </RutaProtegida>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
