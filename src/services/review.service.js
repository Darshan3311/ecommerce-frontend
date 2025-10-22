import api from '../utils/api';

class ReviewService {
  // Get product reviews
  async getProductReviews(productId, params = {}) {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  }

  // Create review
  async createReview(reviewData) {
    const response = await api.post('/reviews', reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.review;
  }

  // Update review
  async updateReview(id, reviewData) {
    const response = await api.put(`/reviews/${id}`, reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.review;
  }

  // Delete review
  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }

  // Add vote to review
  async addVote(id, voteType) {
    const response = await api.post(`/reviews/${id}/vote`, { voteType });
    return response.data.review;
  }
}

export default new ReviewService();
