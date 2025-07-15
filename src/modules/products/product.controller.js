const { User } = require("../../config/db.config").models;
const { Product } = require("../../config/db.config").models;
const { Category } = require("../../config/db.config").models;
const { Review } = require("../../config/db.config").models;
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

    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "categories", through: { attributes: [] } },
        { model: Review, as: "reviews" },
      ],
    });

    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
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
      return res.status(404).json({ message: "Producto no encontrado" });

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
