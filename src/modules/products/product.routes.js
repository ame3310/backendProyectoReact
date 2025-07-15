const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./product.controller");

const requireAuth = require("../../middlewares/requireAuth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const validate = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/multer");
const { productSchema, updateProductSchema } = require("./product.validation");

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.use(autoRefresh);
router.use(requireAuth);

router.post(
  "/",
  requireAdmin,
  upload.fields([{ name: "images", maxCount: 5 }]),
  validate(productSchema),
  createProduct
);

router.patch(
  "/:id",
  requireAdmin,
  upload.fields([{ name: "images", maxCount: 5 }]),
  validate(updateProductSchema),
  updateProduct
);

router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

module.exports = router;
