const { models } = require("../../config/db.config");
const { User, Product, Category, Review, UserFavorite } = models;
const { sequelize } = require("../../config/db.config");
const { AppError } = require("../../middlewares/error-handler");

const getAllProducts = async (req, res, next) => {
  try {
    const { name, minPrice, maxPrice, orderByPrice } = req.query;
    const where = {};
    const order = [];

    if (name) {
      where.name = { [sequelize.Op.like]: `%${name}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[sequelize.Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[sequelize.Op.lte] = parseFloat(maxPrice);
    }

    if (orderByPrice === "asc" || orderByPrice === "desc") {
      order.push(["price", orderByPrice]);
    }

    const products = await Product.findAll({
      where,
      order,
      include: [
        { model: Category, as: "categories", through: { attributes: [] } },
        {
          model: Review,
          as: "reviews",
          include: [{ model: User, as: "User", attributes: ["userName"] }],
        },
      ],
    });

    let favoriteProductIds = [];
    if (req.user) {
      const favorites = await UserFavorite.findAll({
        where: { userId: req.user.id },
        attributes: ["productId"],
      });

      favoriteProductIds = favorites.map((f) => f.productId);
    }

    const productsWithFavorites = products.map((p) => ({
      ...p.toJSON(),
      isFavorite: favoriteProductIds.includes(p.id),
    }));

    res.json(productsWithFavorites);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "categories", through: { attributes: [] } },
        {
          model: Review,
          as: "reviews",
          include: [{ model: User, as: "User", attributes: ["userName"] }],
        },
      ],
    });

    if (!product) return next(new AppError("Producto no encontrado", 404));

    let isFavorite = false;

    if (req.user) {
      const favorite = await UserFavorite.findOne({
        where: {
          userId: req.user.id,
          productId: product.id,
        },
      });

      isFavorite = !!favorite;
    }

    res.json({
      ...product.toJSON(),
      isFavorite,
    });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, price, categoryIds } = req.body;
    const imageFilenames =
      (req.files && req.files.images?.map((file) => file.filename)) || [];

    const product = await Product.create(
      { name, description, price, images: imageFilenames },
      { transaction: t }
    );

    if (categoryIds?.length > 0) {
      await product.setCategories(categoryIds, { transaction: t });
    }

    await t.commit();
    res.status(201).json(product);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, price, categoryIds } = req.body;

    const newImages =
      (req.files && req.files.images?.map((file) => file.filename)) || [];

    let imagesToRemove = req.body.removeImages;
    if (typeof imagesToRemove === "string") {
      try {
        imagesToRemove = JSON.parse(imagesToRemove);
      } catch {
        imagesToRemove = [imagesToRemove];
      }
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) throw new AppError("Producto no encontrado", 404);

    let updatedImages = product.images || [];

    if (Array.isArray(imagesToRemove)) {
      updatedImages = updatedImages.filter(
        (img) => !imagesToRemove.includes(img)
      );
    }

    updatedImages = [...updatedImages, ...newImages];

    await product.update(
      {
        name: name ?? product.name,
        description: description ?? product.description,
        price: price ?? product.price,
        images: updatedImages,
      },
      { transaction: t }
    );

    if (categoryIds) {
      await product.setCategories(categoryIds, { transaction: t });
    }

    await t.commit();
    res.json(product.get({ plain: true }));
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      if (!product) return next(new AppError("Producto no encontrado", 404));

    await product.destroy();
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
