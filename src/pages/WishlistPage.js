import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { 
    wishlist, 
    loading, 
    fetchWishlist, 
    removeFromWishlist, 
    moveToCart, 
    clearWishlist 
  } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist().then(data => {
      console.log('Wishlist fetched:', data);
    }).catch(err => {
      console.error('Failed to fetch wishlist:', err);
    });
  }, [isAuthenticated, navigate, fetchWishlist]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await moveToCart(productId);
    } catch (error) {
      console.error('Move to cart error:', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
      } catch (error) {
        console.error('Clear error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const items = wishlist?.items || [];

  console.log('Wishlist data:', wishlist);
  console.log('Items count:', items.length);
  console.log('Items:', items);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items here to buy them later!
            </p>
            <Link
              to="/products"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${product._id}`} className="block">
                  <div className="aspect-square bg-gray-100 relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-indigo-600">
                      {product.name}
                    </h3>
                    
                    {product.brand && (
                      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    )}

                    <div className="mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-sm mb-3">
                      {product.stock > 0 ? (
                        <span className="text-green-600 font-medium">
                          ✓ In Stock
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          ✗ Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="px-4 pb-4 space-y-2">
                  <button
                    onClick={() => handleMoveToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Move to Cart
                  </button>
                  
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-block text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
