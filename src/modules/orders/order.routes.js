const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getUserAllOrders,
  getOrderById,
  getUserOrderById,
} = require("./order.controller");

const validate = require("../../middlewares/validate.middleware");
const requireAuth = require("../../middlewares/requireAuth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const { orderSchema } = require("./order.validation");

router.use(autoRefresh);
router.post("/", validate(orderSchema), createOrder);
router.get("/", requireAdmin, getAllOrders);
router.get("/user", getUserAllOrders);
router.get("/:id", getOrderById);
router.get("/user/:id", getUserOrderById);

module.exports = router;
