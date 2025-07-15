const bcrypt = require("bcrypt");
const { User } = require("../../config/db.config").models;
const { AppError } = require("../../middlewares/error-handler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt");

const signup = async (req, res, next) => {
  try {
    const { email, password, userName, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw new AppError("Este email ya está registrado", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      userName,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError("Credenciales incorrectas", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Credenciales incorrectas", 401);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      throw new AppError("Token de sesión no proporcionado", 401);

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError("Token de sesión inválido o expirado", 403);
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError("Refresh token no proporcionado", 401);
    }
    const user = await User.findByPk(req.user.id);
    if (!user) throw new AppError("Usuario no encontrado", 404);

    if (user.refreshToken !== refreshToken) {
      throw new AppError("Refresh token inválido", 403);
    }

    user.refreshToken = null;
    await user.save();
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
