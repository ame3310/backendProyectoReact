const jwt = require("jsonwebtoken");
const { verifyRefreshToken, generateAccessToken } = require("../utils/jwt");
const { User } = require("../config/db.config").models;

const { JWT_SECRET } = process.env;

const optionalAuthWithRefresh = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["x-refresh-token"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(accessToken, JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (user) req.user = user;
    return next();
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return next();
    }
    if (!refreshToken) return next();

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(payload.id);

      if (!user || user.refreshToken !== refreshToken) return next();

      const newAccessToken = generateAccessToken(user);
      res.setHeader("x-new-access-token", newAccessToken);

      req.user = user;
    } catch {}
    if (req.user) {
    }
    return next();
  }
};

module.exports = optionalAuthWithRefresh;
