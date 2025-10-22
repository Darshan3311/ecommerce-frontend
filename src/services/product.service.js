import api from '../utils/api';

class ProductService {
  // Get all products
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  }

  // Get product by ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  }

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data.products;
  }

  // Get related products
  async getRelatedProducts(id, limit = 4) {
    const response = await api.get(`/products/${id}/related`, { params: { limit } });
    return response.data.products;
  }

  // Search products
  async searchProducts(query, params = {}) {
    const response = await api.get('/products/search', { params: { q: query, ...params } });
    return response.data;
  }

  // Create product (seller/admin)
  async createProduct(productData) {
    const response = await api.post('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.product;
  }

  // Update product (seller/admin)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.product;
  }

  // Delete product (seller/admin)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
}

export default new ProductService();
