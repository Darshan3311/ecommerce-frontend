import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const cheapestVariant = product.variants?.[0];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      if (cheapestVariant) {
        await addToCart(cheapestVariant, 1);
        toast.success('Added to cart!');
      } else {
        toast.error('Product variant not available');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < Math.floor(rating) ? (
        <StarIconSolid key={index} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarIcon key={index} className="w-4 h-4 text-gray-300" />
      )
    ));
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={primaryImage?.url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </span>
        )}
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            // Add to wishlist logic
          }}
        >
          <HeartIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">{renderStars(product.averageRating)}</div>
          <span className="text-sm text-gray-600">
            ({product.totalReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            ₹{cheapestVariant?.price || 0}
          </span>
          {cheapestVariant?.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{cheapestVariant.compareAtPrice}
            </span>
          )}
          {cheapestVariant?.getDiscountPercentage && cheapestVariant.getDiscountPercentage() > 0 && (
            <span className="text-sm font-semibold text-green-600">
              {cheapestVariant.getDiscountPercentage()}% OFF
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
