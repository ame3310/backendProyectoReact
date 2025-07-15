module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Orders",
      timestamps: true,
      paranoid: true,
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Order.hasMany(models.OrderProduct, {
      foreignKey: "orderId",
      as: "items",
    });

    Order.belongsToMany(models.Product, {
      through: models.OrderProduct,
      foreignKey: "orderId",
      otherKey: "productId",
      as: "products",
    });
  };

  return Order;
};
