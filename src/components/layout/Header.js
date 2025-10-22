import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import useWishlistStore from '../../store/useWishlistStore';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { getWishlistCount, fetchWishlist } = useWishlistStore();
  const cartItemCount = getItemCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch wishlist on mount and when authentication changes
      fetchWishlist().catch(() => {
        // Silently fail if wishlist fetch fails
      });
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-secondary-800 text-white py-2">
        <div className="container-custom flex justify-between items-center text-sm">
          <p>Free shipping on orders over $50</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-accent-400">About</Link>
            <Link to="/contact" className="hover:text-accent-400">Contact</Link>
            <Link to="/help" className="hover:text-accent-400">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-custom py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 flex-shrink-0">
            E-Shop
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2 hover:text-primary-600">
                <HeartIcon className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:text-primary-600">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:text-primary-600">
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden lg:inline">{user?.firstName}</span>
                </button>
                {/* Add padding wrapper to bridge the gap */}
                <div className="absolute right-0 pt-2 hidden group-hover:block z-50">
                  <div className="w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    {(user?.roleName?.toLowerCase() === 'admin' || user?.role?.name?.toLowerCase() === 'admin') && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-primary-600 font-semibold">
                        Admin Dashboard
                      </Link>
                    )}
                    {(user?.roleName?.toLowerCase() === 'seller' || user?.role?.name?.toLowerCase() === 'seller') && (
                      <Link to="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-green-600 font-semibold">
                        Seller Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container-custom py-4">
            <ul className="space-y-4">
              <li>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                  All Products
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                      Orders
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
