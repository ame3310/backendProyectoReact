const { AppError } = require("../../middlewares/error-handler");
const { Review } = require("../../config/db.config").models;
const { User } = require("../../config/db.config").models;
const { Product } = require("../../config/db.config").models;

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "email"] },
        { model: Product, as: "product", attributes: ["id", "name"] },
      ],
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "email"] },
        { model: Product, as: "product", attributes: ["id", "name"] },
      ],
    });
    if (!review)
      if (!review) return next(new AppError("Reseña no encontrada", 404));
    res.json(review);
  } catch (err) {
    next(err);
  }
};

const getReviewsByProductId = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, as: "user", attributes: ["id", "email"] }],
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const getAllReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Product, as: "product", attributes: ["id", "name"] }],
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.create({ userId, productId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(req.params.id);
    if (!review)
      if (!review) return next(new AppError("Reseña no encontrada", 404));

    if (review.userId !== userId)
      return next(new AppError("No autorizado para editar esta reseña", 403));

    await review.update({ rating, comment });
    res.json(review);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return next(new AppError("Reseña no encontrada", 404));

    const isAdmin = req.user.role === "admin";
    const isOwner = review.userId === req.user.id;

    if (!isAdmin && !isOwner) {
      return next(new AppError("No autorizado para borrar esta reseña", 403));
    }

    await review.destroy();
    res.json({ message: "Review eliminada" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getAllReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
};
