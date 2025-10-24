import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/order.service';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await orderService.getUserOrders();
        // res may be { orders, pagination } or array
        const data = res.orders || res;
        setOrders(data || []);
      } catch (error) {
        console.error('Fetch orders error:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  if (!orders || orders.length === 0) return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">My Orders</h2>
      <p className="mt-4 text-gray-600">You have no recent orders.</p>
      <Link to="/products" className="mt-4 inline-block text-indigo-600">Start Shopping</Link>
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="space-y-4">
        {Array.isArray(orders) ? orders.map(order => (
          <div key={order._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Order: {order.orderNumber}</div>
                <div className="text-lg font-semibold">₹{(order.pricing?.total ?? 0).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Status: {order.orderStatus}</div>
              </div>
              <div>
                <Link to={`/orders/${order._id}`} className="text-indigo-600">View Details</Link>
              </div>
            </div>
          </div>
        )) : <div>No orders found</div>}
      </div>
    </div>
  );
};

export default OrdersPage;
