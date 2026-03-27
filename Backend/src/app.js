import express from "express";
import cors from "cors";
import db from "./models/index.js";
import registerRoutes from "./routes/IndexRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

try {
  await db.sequelize.sync();
  console.log("Sequelize models synced successfully."); // si se sincronizo con exito
} catch (error) {
  console.warn("Sequelize sync failed (database may not be configured yet):", error.message); // no se pudo sincronizar, probablemente porque la base de datos no está configurada o no se puede conectar. Esto es común en el primer arranque si la base de datos aún no existe o las credenciales son incorrectas.
}

// ruta de prueba
app.get("/", (req, res) => {
  res.send("API de Gazfast funcionando");
});

// Registrar todas las rutas de API
registerRoutes(app);

export default app;
