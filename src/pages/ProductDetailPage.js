import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        // backend returns envelope { status, data }
  // Backend returns envelope: { status, data: { product } }
  const productData = response?.data?.data?.product || response?.data?.data || response?.data;
        console.log('Fetched product:', productData);
        if (mounted) setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchProduct();
    return () => { mounted = false; };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    try {
      await addToCart(product, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      toast.success('Added to cart!');
      navigate('/cart');
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <button onClick={() => navigate('/products')} className="mt-4 text-indigo-600 hover:text-indigo-800">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                {product.images && product.images.length > 0 && product.images[selectedImage]?.url ? (
                  <img
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-indigo-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {product.brand && (
                  <p className="text-lg text-gray-600 mb-4">Brand: <span className="font-medium">{product.brand}</span></p>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-900">${product.price ? product.price.toFixed(2) : '0.00'}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                          {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-medium text-lg">
                      ✓ In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium text-lg">✗ Out of Stock</p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.description}</p>
                </div>

                {product.shortDescription && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 italic">{product.shortDescription}</p>
                  </div>
                )}

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold px-6">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {product.stock > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(product.features?.length > 0 || product.specifications?.length > 0) && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="font-medium text-gray-900">{spec.name}:</span>
                      <span className="text-gray-700">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
