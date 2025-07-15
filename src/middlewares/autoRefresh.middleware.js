const {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} = require("../utils/jwt");
const { User } = require("../config/db.config").models;
const { AppError } = require("./error-handler");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token de acceso no proporcionado", 401));
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    req.user = verifyAccessToken(accessToken);
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return next(new AppError("Token de acceso inválido", 401));
    }
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError("Refresh token no proporcionado", 401));
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(payload.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError("Refresh token inválido", 403);
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
