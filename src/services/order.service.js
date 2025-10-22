import api from '../utils/api';

class OrderService {
  // Create order
  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res?.data?.order || res?.order || res?.data;
  }

  // Get user orders
  async getUserOrders(params = {}) {
    const res = await api.get('/orders', { params });
    // Normalize possible response shapes:
    // - { status, data: { orders: [...] } }
    // - { orders: [...] }
    // - [...] (array)
    const fromData = res?.data;
    const orders = fromData?.data?.orders || fromData?.orders || fromData;
    return orders;
  }

  // Get order by ID
  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res?.data?.order || res?.order || res?.data;
  }

  // Cancel order
  async cancelOrder(id, reason) {
    const res = await api.post(`/orders/${id}/cancel`, { reason });
    return res?.data?.order || res?.order || res?.data;
  }

  // Update order status (admin/seller)
  async updateOrderStatus(id, status) {
    const res = await api.put(`/orders/${id}/status`, { status });
    return res?.data?.order || res?.order || res?.data;
  }
}

export default new OrderService();
