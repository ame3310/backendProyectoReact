module.exports = (sequelize, DataTypes) => {
  const UserFavorite = sequelize.define(
    "UserFavorite",
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
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "UserFavorites",
      timestamps: true,
    }
  );

  UserFavorite.associate = (models) => {
    UserFavorite.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return UserFavorite;
};
