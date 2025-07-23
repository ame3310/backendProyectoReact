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
const optionalAuthWithRefresh = require("../../middlewares/optionalAuthWithRefresh.middleware");
const validate = require("../../middlewares/validate.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");

const {
  createReviewSchema,
  updateReviewSchema,
} = require("./review.validation");

router.get("/", getAllReviews);
router.get(
  "/product/:productId",
  optionalAuthWithRefresh,
  getReviewsByProductId
);
router.get("/user", autoRefresh, requireAuth, getAllReviewsByUser);
router.get("/:id", getReviewById);

router.use(autoRefresh);
router.use(requireAuth);
router.post(
  "/",
  upload.single("image"),
  validate(createReviewSchema),
  createReview
);

router.put(
  "/:id",
  upload.single("image"),
  validate(updateReviewSchema),
  updateReview
);
router.delete("/:id", deleteReview);
router.post("/:id/like", likeReview);
router.delete("/:id/unlike", unlikeReview);

module.exports = router;
