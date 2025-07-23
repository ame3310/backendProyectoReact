const app = require("./app");
const { sequelize } = require("./config/db.config");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("🔗 Conexión a la base de datos exitosa");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al conectar con la base de datos:", err);
  }
})();
