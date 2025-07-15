require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } =
  process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT || "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
    ssl: false,
  },
});

const models = {
  User: require("../modules/users/user.model")(sequelize, DataTypes),
  Product: require("../modules/products/product.model")(sequelize, DataTypes),
  Order: require("../modules/orders/order.model")(sequelize, DataTypes),
  OrderProduct: require("../modules/orders/orderProduct.model")(
    sequelize,
    DataTypes
  ),
  ProductCategory: require("../modules/products/productCategory.model")(
    sequelize,
    DataTypes
  ),
  Category: require("../modules/categories/category.model")(
    sequelize,
    DataTypes
  ),
  Review: require("../modules/reviews/review.model")(sequelize, DataTypes),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  models,
};
