const { AppError } = require("../../middlewares/error-handler");
const { models } = require("../../config/db.config");
const { User, Product, Review, ReviewLike } = models;

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "email"] },
        { model: Product, as: "product", attributes: ["id", "name"] },
        { model: User, as: "likedBy", attributes: ["id"] },
      ],
    });

    const reviewsWithLikes = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likedBy?.length || 0,
    }));

    res.json(reviewsWithLikes);
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
        { model: User, as: "likedBy", attributes: ["id"] },
      ],
    });

    if (!review) return next(new AppError("Reseña no encontrada", 404));

    res.json({
      ...review.toJSON(),
      likeCount: review.likedBy?.length || 0,
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsByProductId = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [
        { model: User, as: "user", attributes: ["id", "email"] },
        { model: User, as: "likedBy", attributes: ["id"] },
      ],
    });

    const reviewsWithLikes = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likedBy?.length || 0,
    }));

    res.json(reviewsWithLikes);
  } catch (err) {
    next(err);
  }
};

const getAllReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { userId: req.params.userId },
      include: [
        { model: Product, as: "product", attributes: ["id", "name"] },
        { model: User, as: "likedBy", attributes: ["id"] },
      ],
    });

    const reviewsWithLikes = reviews.map((review) => ({
      ...review.toJSON(),
      likeCount: review.likedBy?.length || 0,
    }));

    res.json(reviewsWithLikes);
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : null;

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
      image,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.filename : undefined;

    const review = await Review.findByPk(req.params.id);
    if (!review) return next(new AppError("Reseña no encontrada", 404));

    if (review.userId !== userId)
      return next(new AppError("No autorizado para editar esta reseña", 403));

    const updateData = { rating, comment };

    if (image !== undefined) {
      updateData.image = image;
    }

    await review.update(updateData);

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

const likeReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const [like, created] = await ReviewLike.findOrCreate({
      where: { reviewId, userId },
    });

    if (!created) {
      throw new AppError("Ya diste like a esta reseña.", 400);
    }

    res.status(201).json({ message: "Like añadido a la reseña." });
  } catch (err) {
    next(err);
  }
};

const unlikeReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const deleted = await ReviewLike.destroy({
      where: { reviewId, userId },
    });

    if (!deleted) {
      throw new AppError("No habías dado like a esta reseña.", 404);
    }

    res.json({ message: "Like eliminado de la reseña." });
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
  likeReview,
  unlikeReview,
};
