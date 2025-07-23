const enrichReviews = (reviews, userId = null) => {
  return reviews.map((review) => {
    const r = typeof review.toJSON === "function" ? review.toJSON() : review;

    const likedByUser = userId
      ? r.likedBy?.some((u) => String(u.id) === String(userId))
      : false;

    return {
      ...r,
      likeCount: r.likedBy?.length || 0,
      likedByUser,
    };
  });
};

module.exports = enrichReviews;
