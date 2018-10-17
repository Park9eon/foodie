export const getRating = (eatery) => {
  if (eatery && eatery.reviews && eatery.reviews.length > 0) {
    const hasRating = eatery.reviews.filter(review => review.rating)
      .map(review => review.rating);
    if (hasRating.length > 0) {
      return Math.round(hasRating.reduce((left, right) => left + right, 0) / hasRating.length);
    }
  }
  return 0;
};
