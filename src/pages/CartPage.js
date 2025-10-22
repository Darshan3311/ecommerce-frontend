import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, subtotal, tax, total, isLoading, fetchCart, updateCartItem, removeFromCart, clearCart } = useCartStore();
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    // Always call fetchCart; the store will load local cart for guests or server cart for authenticated users
    fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleUpdateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    setUpdating(productId);
    try {
      await updateCartItem(productId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (item) => {
    const productIdToRemove = item.productListing?._id || item.product._id || item.productId;
    setUpdating(productIdToRemove);
    try {
      await removeFromCart(productIdToRemove);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Remove item error:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
          >
            <TrashIcon className="h-5 w-5" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.product;
              const isUpdating = updating === product._id;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    {product.images && product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-sm text-gray-600 mb-2">
                            Brand: {product.brand}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-indigo-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item)}
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-800 p-2 h-10"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity, -1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(product._id, item.quantity, 1)}
                          disabled={isUpdating || (product.stock && item.quantity >= product.stock)}
                          className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {product.stock && (
                        <span className="text-sm text-gray-500">
                          ({product.stock} available)
                        </span>
                      )}
                    </div>

                    {/* Subtotal */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Subtotal: <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-4 bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Continue Shopping
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center mb-2">Secure Checkout</p>
                <div className="flex justify-center gap-3 opacity-60">
                  <span className="text-xs">🔒 SSL</span>
                  <span className="text-xs">💳 Visa</span>
                  <span className="text-xs">💳 Mastercard</span>
                  <span className="text-xs">💳 PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
