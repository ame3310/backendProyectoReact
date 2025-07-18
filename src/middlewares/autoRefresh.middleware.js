const {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} = require("../utils/jwt");
const { User } = require("../config/db.config").models;
const { AppError } = require("./error-handler");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.headers["x-refresh-token"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Token de acceso no proporcionado", 401, "NO_ACCESS_TOKEN")
    );
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(accessToken);
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return next(
        new AppError("Token de acceso inválido", 401, "INVALID_ACCESS_TOKEN")
      );
    }

    if (!refreshToken) {
      return next(
        new AppError("Refresh token no proporcionado", 401, "NO_REFRESH_TOKEN")
      );
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError(
          "Refresh token inválido",
          403,
          "INVALID_REFRESH_TOKEN"
        );
      }

      const newAccessToken = generateAccessToken(user);

      res.setHeader("x-new-access-token", newAccessToken);

      req.user = { id: user.id, role: user.role };

      return next();
    } catch (refreshErr) {
      return next(refreshErr);
    }
  }
};
