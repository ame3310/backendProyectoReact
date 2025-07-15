const { Order } = require("../../config/db.config").models;
const { OrderProduct } = require("../../config/db.config").models;
const { Product } = require("../../config/db.config").models;
const { User } = require("../../config/db.config").models;
const { AppError } = require("../../middlewares/error-handler");

const createOrder = async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("Debes enviar al menos un producto", 400));
  }

  try {
    const order = await Order.create({ userId });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return next(
          new AppError(`Producto con ID ${item.productId} no encontrado`, 404)
        );
      }

      await OrderProduct.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity || 1,
        price: product.price,
      });
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: Product, as: "products" }],
    });

    res.status(201).json(fullOrder);
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "userName"],
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getUserAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "userName"],
        },
      ],
    });

    if (!order) return next(new AppError("Orden no encontrada", 404));

    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("No autorizado para ver esta orden", 403));
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

const getUserOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity", "price"] },
        },
      ],
    });

    if (!order) return next(new AppError("Orden no encontrada", 404));
    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return next(new AppError("No autorizado para ver esta orden", 403));
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserAllOrders,
  getOrderById,
  getUserOrderById,
};
