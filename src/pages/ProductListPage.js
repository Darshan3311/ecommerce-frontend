import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { ShoppingCartIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  // Get category and search from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        const cats = response.data || [];
        if (mounted) setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
    return () => { mounted = false; };
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      const searchQuery = searchParams.get('search');
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/products', { params });
      const productsData = response.data?.products || response.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchParams.toString()]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success('Added to cart!');
    }
  };

  const handleToggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }

    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const searchQuery = searchParams.get('search');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Products</span>
          </nav>
        </div>

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results for "{searchQuery}"
            </h1>
            <p className="text-gray-600 mt-2">{products.length} products found</p>
          </div>
        )}

        {/* Category Filter Buttons */}
        {!searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Shop by Category</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchParams({});
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setSearchParams({ category: cat._id });
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === cat._id
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {cat.name}
              </button>
            ))}
            </div>
          </div>
        )}

        {/* Products Count */}
        <p className="mb-6 text-center text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
            <button
              onClick={() => setSelectedCategory('')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(e, product._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    {isInWishlist(product._id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </button>

                  <Link to={`/products/${product._id}`}>
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>

                      {product.brand && (
                        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.numReviews || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="text-sm mb-3">
                        {product.stock > 0 ? (
                          <span className="text-green-600 font-medium">
                            ✓ In Stock ({product.stock} available)
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
