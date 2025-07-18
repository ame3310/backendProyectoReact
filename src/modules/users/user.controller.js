const { models } = require("../../config/db.config");
const { User, Order, Product, Review, UserFavorite } = models;
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
        {
          model: Product,
          as: "favorites",
          attributes: ["id", "name", "price", "images"],
          through: { attributes: [] },
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
    if (req.file) user.avatar = req.file.filename;

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

const addFavoriteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const [favorite, created] = await UserFavorite.findOrCreate({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (!created) {
      return res
        .status(400)
        .json({ message: "El producto ya está en favoritos." });
    }

    res.status(201).json({ message: "Producto añadido a favoritos." });
  } catch (err) {
    next(err);
  }
};

const removeFavoriteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const deleted = await UserFavorite.destroy({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "El producto no estaba en favoritos." });
    }

    res.json({ message: "Producto eliminado de favoritos." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  addFavoriteProduct,
  removeFavoriteProduct,
};
