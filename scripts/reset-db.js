const { execSync } = require("child_process");

function run(command, skipOnError = false) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    if (skipOnError) {
      console.warn(
        `⚠️  Continuing after error in "${command}" (skipOnError enabled)`
      );
    } else {
      throw error;
    }
  }
}

try {
  console.log("⏪ Revirtiendo todos los seeders...");
  run("npx sequelize-cli db:seed:undo:all", true);

  console.log("⏪ Revirtiendo todas las migraciones...");
  run("npx sequelize-cli db:migrate:undo:all", true);

  console.log("🚀 Aplicando migraciones nuevamente...");
  run("npx sequelize-cli db:migrate");

  console.log("🌱 Ejecutando seeders...");
  run("npx sequelize-cli db:seed:all");

  console.log("\n✅ Base de datos reiniciada correctamente.");
} catch (error) {
  console.error("❌ Error al reiniciar la base de datos:");
  console.error(error.message || error);
}
