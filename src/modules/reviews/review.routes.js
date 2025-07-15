const express = require("express");
const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getAllReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
} = require("./review.controller");

const requireAuth = require("../../middlewares/requireAuth.middleware");
const validate = require("../../middlewares/validate.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const { reviewSchema } = require("./review.validation");

router.get("/", getAllReviews);
router.get("/product/:productId", getReviewsByProductId);
router.get("/user/:userId", getAllReviewsByUser);
router.get("/:id", getReviewById);

router.use(autoRefresh);
router.use(requireAuth);

router.post("/", validate(reviewSchema), createReview);
router.put("/:id", validate(reviewSchema), updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
