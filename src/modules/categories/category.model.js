module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "Categories",
      timestamps: true,
      paranoid: true,
    }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.Product, {
      through: "ProductCategory",
      foreignKey: "categoryId",
      otherKey: "productId",
      as: "products",
    });
  };

  return Category;
};
