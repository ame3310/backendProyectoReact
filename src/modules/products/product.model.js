module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const raw = this.getDataValue("images");
          return raw ? JSON.parse(raw) : [];
        },
        set(val) {
          this.setDataValue("images", JSON.stringify(val));
        },
      },
    },
    {
      tableName: "Products",
      timestamps: true,
      paranoid: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Category, {
      through: "ProductCategory",
      foreignKey: "productId",
      otherKey: "categoryId",
      as: "categories",
    });

    Product.belongsToMany(models.Order, {
      through: models.OrderProduct,
      foreignKey: "productId",
      otherKey: "orderId",
      as: "orders",
    });

    Product.hasMany(models.Review, {
      foreignKey: "productId",
      as: "reviews",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
