import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuthStore();
  const { syncCart } = useCartStore();

  // Get the page they were trying to access, or default to dashboard
  const from = location.state?.from || null;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // If there's no explicit 'from' location, route by role
      const role = (user?.roleName || user?.role?.name || '').toLowerCase();
      if (!from) {
        if (role === 'admin') return navigate('/admin/dashboard', { replace: true });
        if (role === 'seller') return navigate('/seller/dashboard', { replace: true });
        return navigate('/dashboard', { replace: true });
      }
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, user]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await login(values);
        await syncCart();
        toast.success('Login successful!');
        // If a target path was provided (redirect after login), honor it.
        if (from) return navigate(from, { replace: true });

        // Otherwise, redirect based on role
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        const roleName = (stored?.roleName || stored?.role?.name || '').toLowerCase();
        if (roleName === 'admin') return navigate('/admin/dashboard', { replace: true });
        if (roleName === 'seller') return navigate('/seller/dashboard', { replace: true });
        navigate('/dashboard', { replace: true });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            <Link to="/seller/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register as Seller
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`input ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`input ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
