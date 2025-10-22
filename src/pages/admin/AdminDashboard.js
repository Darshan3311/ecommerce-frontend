import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import {
  UsersIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

import useAuthStore from '../../store/useAuthStore';

const AdminDashboard = () => {
  const { token } = useAuthStore(); // Get token from Zustand store
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingSellers: 0
  });

  useEffect(() => {
    let mounted = true;
    const fetchPendingSellers = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await api.get('/sellers', { params: { status: 'pending', _t: timestamp } });

        console.log('Full seller API response:', response.data);
        const sellers = response.data?.data || response.data || [];
        console.log('Setting pending sellers:', sellers);
        if (mounted) {
          setPendingSellers(sellers);
          setStats(prev => ({ ...prev, pendingSellers: sellers.length }));
        }
      } catch (error) {
        console.error('Error fetching pending sellers:', error);
        console.error('Error response:', error.response?.data);
        toast.error(error.response?.data?.message || 'Failed to fetch pending sellers');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPendingSellers();
    return () => { mounted = false; };
  }, []);

  const handleApproveSeller = async (sellerId) => {
    try {
      const response = await api.put(`/sellers/${sellerId}/approve`, {});
      if (response.data?.success) {
        toast.success('Seller approved successfully!');
        // re-fetch
        const timestamp = new Date().getTime();
        const refreshed = await api.get('/sellers', { params: { status: 'pending', _t: timestamp } });
        setPendingSellers(refreshed.data?.data || refreshed.data || []);
      }
    } catch (error) {
      console.error('Error approving seller:', error);
      toast.error(error.response?.data?.message || 'Failed to approve seller');
    }
  };

  const handleRejectSeller = async (sellerId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const response = await api.put(`/sellers/${sellerId}/reject`, { reason });
      if (response.data?.success) {
        toast.success('Seller rejected');
        const timestamp = new Date().getTime();
        const refreshed = await api.get('/sellers', { params: { status: 'pending', _t: timestamp } });
        setPendingSellers(refreshed.data?.data || refreshed.data || []);
      }
    } catch (error) {
      console.error('Error rejecting seller:', error);
      toast.error(error.response?.data?.message || 'Failed to reject seller');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users, products, orders, and seller applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingBagIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCartIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending Sellers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Sellers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingSellers}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-500">View all users</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-500">View all products</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-500">View all orders</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/reviews"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Reviews</h3>
                <p className="text-sm text-gray-500">Moderate reviews</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Pending Seller Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BuildingStorefrontIcon className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Pending Seller Applications</h2>
              </div>
              {stats.pendingSellers > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {stats.pendingSellers} Pending
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <p className="mt-2 text-gray-600">Loading seller applications...</p>
              </div>
            ) : pendingSellers.length === 0 ? (
              <div className="text-center py-12">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No pending seller applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSellers.map((seller) => (
                  <div
                    key={seller._id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      {/* Seller Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">{seller.businessName}</h3>
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Pending
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Owner:</span>{' '}
                              {seller.user?.firstName} {seller.user?.lastName}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Email:</span>{' '}
                              {seller.businessEmail || seller.user?.email}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Phone:</span>{' '}
                              {seller.businessPhone || seller.user?.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Tax ID:</span> {seller.taxId || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">License:</span> {seller.businessLicense || 'N/A'}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Location:</span>{' '}
                              {seller.businessAddress?.city}, {seller.businessAddress?.country}
                            </p>
                          </div>
                        </div>

                        {seller.description && (
                          <p className="mt-3 text-sm text-gray-600 italic">"{seller.description}"</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 md:ml-6">
                        <button
                          onClick={() => handleApproveSeller(seller._id)}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectSeller(seller._id)}
                          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircleIcon className="h-5 w-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
