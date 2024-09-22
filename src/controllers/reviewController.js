// src/controllers/reviewController.js
const supabase = require('../supabaseClient');

// Create Review
async function createReview(req, res) {
  const { productId, rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ product_id: productId, user_id: userId, rating, comment }]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({ message: 'Review created successfully', review: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Product Reviews
async function getProductReviews(req, res) {
  const productId = req.params.productId;

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId);

    if (error) return res.status(400).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: 'No reviews found for this product' });

    return res.status(200).json({ reviews: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update Review
async function updateReview(req, res) {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    // Ensure that the user can only update their own reviews
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (reviewError || reviewData.user_id !== userId) {
      return res.status(403).json({ error: 'You can only update your own reviews' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('id', reviewId);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ message: 'Review updated successfully', review: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete Review
async function deleteReview(req, res) {
  const reviewId = req.params.id;
  const userId = req.user.userId;

  try {
    // Ensure that the user can only delete their own reviews
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (reviewError || reviewData.user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .select("*");

    if (error) return res.status(400).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: 'Review not found' });

    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
