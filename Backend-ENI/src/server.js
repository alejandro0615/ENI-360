import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usuarioRoutes from "./routes/usuarios.js";
import { conectarDB, sequelize } from "./database/config.js";
import { Usuario } from "./database/models/usuarios.js";
import areaRoutes from "./routes/areas.js";


dotenv.config();

const app = express();
app.use(express.json());



app.use(cors({
  origin: "http://localhost:5173", // puerto típico de Vite
  credentials: true
}));

app.use("/uploads", express.static("uploads")); // para que puedas ver las imágenes subidas en la carpeta "uploads"

// Conectar a BD
conectarDB();

// Sincronizar modelos con tabla (crea si no existe)
sequelize.sync().then(() => {
  console.log("🗂️ Modelos sincronizados con MySQL");
});

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/areas", areaRoutes);

app.get("/", (req, res) => {
  res.json({ mensaje: "API ENI lista 🚀 con MySQL" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
