module.exports = (sequelize, DataTypes) => {
  const ReviewLike = sequelize.define(
    "ReviewLike",
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
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "ReviewLikes",
      timestamps: true,
    }
  );

  return ReviewLike;
};
