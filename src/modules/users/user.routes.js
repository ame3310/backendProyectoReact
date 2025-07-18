const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  addFavoriteProduct,
  removeFavoriteProduct,
} = require("./user.controller");

const requireAuth = require("../../middlewares/requireAuth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const validate = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/multer");
const { updateUserSchema } = require("./user.validation");

router.use(autoRefresh);
router.use(requireAuth);

router.get("/profile", getProfile);
router.patch(
  "/profile",
  upload.single("avatar"),
  validate(updateUserSchema),
  updateProfile
);
router.delete("/profile", deleteProfile);
router.post("/favorites/:productId", addFavoriteProduct);
router.delete("/favorites/:productId", removeFavoriteProduct);
router.get("/", requireAdmin, getAllUsers);

module.exports = router;
