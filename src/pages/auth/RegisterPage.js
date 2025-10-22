import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('First name is required'),
      lastName: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/\d/, 'Password must contain at least one number')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      phone: Yup.string()
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await register(values);
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Want to sell on our platform?{' '}
            <Link to="/seller/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register as Seller
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={`input ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}`}
                placeholder="John"
                {...formik.getFieldProps('firstName')}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={`input ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Doe"
                {...formik.getFieldProps('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`input ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                placeholder="john.doe@example.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="+1 234 567 8900"
                {...formik.getFieldProps('phone')}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                {...formik.getFieldProps('confirmPassword')}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
