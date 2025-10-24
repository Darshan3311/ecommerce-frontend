import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';
import { toast } from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const o = await orderService.getOrderById(id);
        setOrder(o);
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const updated = await orderService.cancelOrder(id, 'Cancelled by user');
      setOrder(updated);
      toast.success('Order cancelled');
    } catch (error) {
      console.error('Cancel failed:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order {order.orderNumber}</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <strong>Status:</strong> {order.orderStatus}
        </div>
        <div className="mb-4">
          <strong>Total:</strong> ₹{order.pricing.total.toFixed(2)}
        </div>
        <div className="mb-4">
          <strong>Shipping Address:</strong>
          <div>{order.shippingAddress.fullName}</div>
          <div>{order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}</div>
          <div>{order.shippingAddress.city}, {order.shippingAddress.state}</div>
          <div>{order.shippingAddress.country} - {order.shippingAddress.zipCode}</div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Items</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map(item => (
              <li key={item._id} className="flex justify-between">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div>₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>

        {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
          <div className="mt-6">
            <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded">Cancel Order</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
