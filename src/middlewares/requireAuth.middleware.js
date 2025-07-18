const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("./error-handler");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token no proporcionado", 401, "NO_ACCESS_TOKEN"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401, "TOKEN_EXPIRED"));
    }

    return next(new AppError("Token inválido", 401, "INVALID_TOKEN"));
  }
};
