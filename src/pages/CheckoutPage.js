import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import orderService from '../services/order.service';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

const ShippingSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phone: Yup.string().required('Phone number is required'),
  addressLine1: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipCode: Yup.string().required('Zip code is required')
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart } = useCartStore();

  const initialValues = {
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    paymentMethod: 'cod',
    notes: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    const orderPayload = {
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipCode
      },
      payment: {
        method: values.paymentMethod
      },
      notes: values.notes
    };

    try {
      setSubmitting(true);
      const order = await orderService.createOrder(orderPayload);
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
        console.error('Create order error:', error);
        console.error('Error response data:', error.response?.data);
        console.error('Validation errors:', error.response?.data?.errors);
        const serverMessage = error.response?.data?.message;
        const serverErrors = error.response?.data?.errors;
        if (serverErrors && Array.isArray(serverErrors)) {
          console.error('First validation error:', serverErrors[0]);
          toast.error(serverErrors[0].msg || serverErrors[0].message || 'Validation failed');
        } else {
          toast.error(serverMessage || 'Failed to place order');
        }
    } finally {
      setSubmitting(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="bg-indigo-600 text-white px-6 py-3 rounded">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <p className="text-gray-600">Items: {items.length}</p>
          <p className="text-gray-600">Subtotal: ${subtotal.toFixed(2)}</p>
          <p className="text-gray-600">Tax (8%): ${tax.toFixed(2)}</p>
          <p className="text-lg font-bold mt-2">Total: ${total.toFixed(2)}</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={ShippingSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <Field name="fullName" className="w-full border px-3 py-2 rounded" placeholder="John Doe" />
                  {errors.fullName && touched.fullName && <div className="text-red-600 text-sm mt-1">{errors.fullName}</div>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Field name="phone" className="w-full border px-3 py-2 rounded" placeholder="+1234567890" />
                  {errors.phone && touched.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                  <Field name="addressLine1" className="w-full border px-3 py-2 rounded" placeholder="Street address" />
                  {errors.addressLine1 && touched.addressLine1 && <div className="text-red-600 text-sm mt-1">{errors.addressLine1}</div>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address Line 2 (optional)</label>
                  <Field name="addressLine2" className="w-full border px-3 py-2 rounded" placeholder="Apartment, suite, etc." />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <Field name="city" className="w-full border px-3 py-2 rounded" placeholder="City" />
                  {errors.city && touched.city && <div className="text-red-600 text-sm mt-1">{errors.city}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <Field name="state" className="w-full border px-3 py-2 rounded" placeholder="State" />
                  {errors.state && touched.state && <div className="text-red-600 text-sm mt-1">{errors.state}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <Field name="country" className="w-full border px-3 py-2 rounded" placeholder="Country" />
                  {errors.country && touched.country && <div className="text-red-600 text-sm mt-1">{errors.country}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code *</label>
                  <Field name="zipCode" className="w-full border px-3 py-2 rounded" placeholder="12345" />
                  {errors.zipCode && touched.zipCode && <div className="text-red-600 text-sm mt-1">{errors.zipCode}</div>}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <label className="flex items-center gap-2 p-3 border rounded cursor-pointer">
                  <Field type="radio" name="paymentMethod" value="cod" />
                  <span className="font-medium">Cash on Delivery (COD)</span>
                </label>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Order Notes (optional)</label>
                <Field as="textarea" name="notes" rows="3" className="w-full border px-3 py-2 rounded" placeholder="Any special instructions..." />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold hover:bg-indigo-700 disabled:bg-gray-400">
                  {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
                </button>
                <button type="button" onClick={() => navigate('/cart')} className="text-gray-600 hover:text-gray-800">
                  Back to Cart
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CheckoutPage;
