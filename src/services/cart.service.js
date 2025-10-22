import api from '../utils/api';

class CartService {
  // Get cart
  async getCart() {
    // api returns the parsed body { status, data }
    const res = await api.get('/cart');
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Add to cart
  async addToCart(productId, quantity = 1) {
    const res = await api.post('/cart/add', { productId, quantity });
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Update cart item
  async updateCartItem(productId, quantity) {
    const res = await api.put(`/cart/${productId}`, { quantity });
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Remove from cart
  async removeFromCart(productId) {
    const res = await api.delete(`/cart/${productId}`);
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Clear cart
  async clearCart() {
    const res = await api.delete('/cart');
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Sync cart
  async syncCart(items) {
    const res = await api.post('/cart/sync', { items });
    return res?.data?.cart || res?.cart || res?.data;
  }

  // Local cart management (for non-logged-in users)
  getLocalCart() {
    const cartStr = localStorage.getItem('cart');
    // Ensure local cart shape matches server cart shape (includes subtotal, tax, total)
    if (cartStr) return JSON.parse(cartStr);
    return { items: [], subtotal: 0, tax: 0, total: 0 };
  }

  saveLocalCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addToLocalCart(product, quantity = 1) {
    const cart = this.getLocalCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product._id);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        product: product,
        quantity: quantity,
        price: product.price
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.saveLocalCart(cart);
    return cart;
  }

  removeFromLocalCart(productId) {
    const cart = this.getLocalCart();
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.saveLocalCart(cart);
    return cart;
  }

  clearLocalCart() {
    localStorage.removeItem('cart');
  }
}

const cartServiceInstance = new CartService();
export default cartServiceInstance;
