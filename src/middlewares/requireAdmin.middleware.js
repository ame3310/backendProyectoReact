const { AppError } = require("./error-handler");

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(
      new AppError("Acceso no autorizado: solo administradores", 403)
    );
  }

  next();
};
