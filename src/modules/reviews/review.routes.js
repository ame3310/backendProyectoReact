const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer");

const {
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
  getAllReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
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

router.post("/", upload.single("image"), validate(reviewSchema), createReview);
router.put(
  "/:id",
  upload.single("image"),
  validate(reviewSchema),
  updateReview
);
router.delete("/:id", deleteReview);
router.post("/:id/like", likeReview);
router.delete("/:id/unlike", unlikeReview);

module.exports = router;
