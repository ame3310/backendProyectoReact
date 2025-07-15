const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  searchByCategoryName,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./category.controller");

const validate = require("../../middlewares/validate.middleware");
const requireAuth = require("../../middlewares/requireAuth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const { categorySchema } = require("./category.validation");

router.get("/", getAllCategories);
router.get("/search", searchByCategoryName);
router.get("/:id", getCategoryById);

router.use(autoRefresh);
router.use(requireAuth);

router.post("/", requireAdmin, validate(categorySchema), createCategory);
router.put("/:id", requireAdmin, validate(categorySchema), updateCategory);
router.delete("/:id", requireAdmin, deleteCategory);

module.exports = router;
