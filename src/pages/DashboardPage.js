import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon, 
  ClipboardDocumentListIcon,
  CogIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/useAuthStore';

const DashboardPage = () => {
  const { user } = useAuthStore();

  // Debug: Log user object to console
  console.log('Current user object:', user);
  console.log('User role object:', user?.role);
  console.log('User roleName:', user?.roleName);
  console.log('All user keys:', user ? Object.keys(user) : 'no user');
  console.log('Full user JSON:', JSON.stringify(user, null, 2));

  // Check if user is admin (case-insensitive)
  const isAdmin = 
    user?.roleName?.toLowerCase() === 'admin' || 
    user?.role?.name?.toLowerCase() === 'admin';
  console.log('Is Admin?', isAdmin);

  // Check if user is seller (case-insensitive)
  const isSeller = 
    user?.roleName?.toLowerCase() === 'seller' || 
    user?.role?.name?.toLowerCase() === 'seller';
  console.log('Is Seller?', isSeller);

  const menuItems = [
    {
      title: 'My Orders',
      description: 'Track, return, or buy things again',
      icon: ShoppingBagIcon,
      link: '/orders',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'My Profile',
      description: 'Edit personal information and settings',
      icon: UserIcon,
      link: '/profile',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Wishlist',
      description: 'View your saved items',
      icon: HeartIcon,
      link: '/wishlist',
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Shopping Cart',
      description: 'View and manage cart items',
      icon: ShoppingBagIcon,
      link: '/cart',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Addresses',
      description: 'Manage shipping addresses',
      icon: TruckIcon,
      link: '/addresses',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Account Settings',
      description: 'Change password and preferences',
      icon: CogIcon,
      link: '/settings',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  return (
    <div className="container-custom py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'User'}! 👋
        </h1>
        <p className="text-primary-100">
          Manage your orders, profile, and preferences from your dashboard
        </p>
        <div className="flex gap-4 mt-4">
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Go to Admin Dashboard →
            </Link>
          )}
          {isSeller && (
            <Link
              to="/seller/dashboard"
              className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Go to Seller Dashboard →
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ClipboardDocumentListIcon className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <HeartIcon className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cart Items</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ShoppingBagIcon className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Saved Addresses</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <TruckIcon className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`${item.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <ClipboardDocumentListIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">Your recent orders and activities will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
