module.exports = (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define(
    "OrderProduct",
    {
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "OrderProduct",
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeSave: async (orderProduct, options) => {
          const { models } = sequelize;
          const exists = await models.Product.findByPk(orderProduct.productId);
          if (!exists) {
            throw new Error(
              `No se puede añadir el producto ${orderProduct.productId}, no existe.`
            );
          }
        },
      },
    }
  );

  OrderProduct.associate = () => {};

  return OrderProduct;
};
