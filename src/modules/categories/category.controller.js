const { Category } = require("../../config/db.config").models;
const { Product } = require("../../config/db.config").models;

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [
        { model: Product, as: "products", through: { attributes: [] } },
      ],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Product, as: "products", through: { attributes: [] } },
      ],
    });
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const searchByCategoryName = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name)
      return res
        .status(400)
        .json({ message: "Debes proporcionar un nombre de categoría" });

    const category = await Category.findOne({
      where: { name },
      include: [
        { model: Product, as: "products", through: { attributes: [] } },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(category.products);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    await category.update({ name: req.body.name });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Categoría no encontrada" });

    await category.destroy();
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  searchByCategoryName,
  createCategory,
  updateCategory,
  deleteCategory,
};
