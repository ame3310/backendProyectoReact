module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "Users",
      paranoid: true,
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders" });
    User.hasMany(models.Review, { foreignKey: "userId", as: "reviews" });

    User.belongsToMany(models.Product, {
      through: models.UserFavorite,
      as: "favorites",
      foreignKey: "userId",
      otherKey: "productId",
      onDelete: "CASCADE",
    });

    User.hasMany(models.ReviewLike, {
      foreignKey: "userId",
      as: "reviewLikes",
      onDelete: "CASCADE",
    });
  };

  return User;
};
