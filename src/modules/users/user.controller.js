const { models } = require("../../config/db.config");
const { User, Order, Product } = models;
const bcrypt = require("bcrypt");
const { AppError } = require("../../middlewares/error-handler");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "userName", "email", "role", "avatar"],
      include: [
        {
          model: Order,
          as: "orders",
          include: [
            {
              model: Product,
              as: "products",
              attributes: ["id", "name", "description", "price", "images"],
              through: { attributes: ["quantity"] },
            },
          ],
        },
        {
          model: Review,
          as: "reviews",
        },
      ],
    });

    if (!user) return next(new AppError("Usuario no encontrado", 404));
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return next(new AppError("Usuario no encontrado", 404));

    if (userName) user.userName = userName;
    if (password) user.password = await bcrypt.hash(password, 10);

    if (req.file) {
      user.avatar = req.file.filename;
    }

    await user.save();
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError("Usuario no encontrado", 404));

    await user.destroy();
    res.json({ message: "Perfil eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "userName", "role", "avatar"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
};
