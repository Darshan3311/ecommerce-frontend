import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import orderService from '../../services/order.service';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Get seller profile to determine seller id
      const profileRes = await api.get('/sellers/profile');
      const seller = profileRes.data?.data || profileRes.data;
      const sellerId = seller?._id || seller?.id || (seller && seller.user && seller.user._id);
      if (!sellerId) {
        toast.error('Seller profile not found');
        setOrders([]);
        return;
      }

      const res = await api.get(`/orders/seller/${sellerId}`);
      const data = res?.data?.data || res?.data;
      const fetched = data?.orders || data?.orders || data || [];
      setOrders(fetched);
    } catch (error) {
      console.error('Failed to load seller orders', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success('Order updated');
      fetchOrders();
    } catch (err) {
      console.error('Failed to update order status', err);
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.pricing?.total?.toFixed ? order.pricing.total.toFixed(2) : (order.pricing?.total || '0.00')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{order.orderStatus}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                        <select defaultValue="" onChange={(e) => { if (e.target.value) changeStatus(order._id, e.target.value); }} className="border rounded px-2 py-1">
                          <option value="">Change status</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;
