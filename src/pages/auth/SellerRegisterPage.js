import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../../store/useAuthStore';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  BuildingStorefrontIcon, 
  
  MapPinIcon,
  
  UserIcon
} from '@heroicons/react/24/outline';

const SellerRegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      // Personal Information
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      
      // Business Information
      businessName: '',
      businessEmail: '',
      businessPhone: '',
      description: '',
      taxId: '',
      businessLicense: '',
      
      // Business Address
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      
      // Agreement
      agreeToTerms: false
    },
    validationSchema: Yup.object({
      // Personal validation
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
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
      
      // Business validation
      businessName: Yup.string()
        .required('Business name is required'),
      businessEmail: Yup.string()
        .email('Invalid email address'),
      businessPhone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      description: Yup.string()
        .max(2000, 'Description cannot exceed 2000 characters'),
      taxId: Yup.string()
        .required('Tax ID is required'),
      businessLicense: Yup.string()
        .required('Business license number is required'),
      
      // Address validation
      addressLine1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      zipCode: Yup.string().required('ZIP code is required'),
      
      agreeToTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await api.post('/sellers/register', {
          ...values,
          businessAddress: {
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2,
            city: values.city,
            state: values.state,
            country: values.country,
            zipCode: values.zipCode
          }
        });

        toast.success('Registration successful! Your application is pending admin approval. You can login once approved.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <BuildingStorefrontIcon className="mx-auto h-16 w-16 text-primary-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Become a Seller
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our marketplace and start selling your products today
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`input ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('firstName')}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`input ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('lastName')}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`input ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('phone')}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`input ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('password')}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('confirmPassword')}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <hr />

            {/* Business Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    className={`input ${formik.touched.businessName && formik.errors.businessName ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('businessName')}
                  />
                  {formik.touched.businessName && formik.errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email
                  </label>
                  <input
                    id="businessEmail"
                    type="email"
                    className={`input ${formik.touched.businessEmail && formik.errors.businessEmail ? 'border-red-500' : ''}`}
                    placeholder="Leave empty to use personal email"
                    {...formik.getFieldProps('businessEmail')}
                  />
                  {formik.touched.businessEmail && formik.errors.businessEmail && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.businessEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Phone
                  </label>
                  <input
                    id="businessPhone"
                    type="tel"
                    className={`input ${formik.touched.businessPhone && formik.errors.businessPhone ? 'border-red-500' : ''}`}
                    placeholder="Leave empty to use personal phone"
                    {...formik.getFieldProps('businessPhone')}
                  />
                  {formik.touched.businessPhone && formik.errors.businessPhone && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.businessPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className={`input ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''}`}
                    placeholder="Tell us about your business..."
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID / EIN *
                  </label>
                  <input
                    id="taxId"
                    type="text"
                    className={`input ${formik.touched.taxId && formik.errors.taxId ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('taxId')}
                  />
                  {formik.touched.taxId && formik.errors.taxId && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.taxId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 mb-1">
                    Business License Number *
                  </label>
                  <input
                    id="businessLicense"
                    type="text"
                    className={`input ${formik.touched.businessLicense && formik.errors.businessLicense ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('businessLicense')}
                  />
                  {formik.touched.businessLicense && formik.errors.businessLicense && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.businessLicense}</p>
                  )}
                </div>
              </div>
            </div>

            <hr />

            {/* Business Address Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Business Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    className={`input ${formik.touched.addressLine1 && formik.errors.addressLine1 ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('addressLine1')}
                  />
                  {formik.touched.addressLine1 && formik.errors.addressLine1 && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.addressLine1}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    className="input"
                    {...formik.getFieldProps('addressLine2')}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`input ${formik.touched.city && formik.errors.city ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('city')}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province *
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={`input ${formik.touched.state && formik.errors.state ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('state')}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.state}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    id="country"
                    type="text"
                    className={`input ${formik.touched.country && formik.errors.country ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('country')}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.country}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code *
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    className={`input ${formik.touched.zipCode && formik.errors.zipCode ? 'border-red-500' : ''}`}
                    {...formik.getFieldProps('zipCode')}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            <hr />

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                {...formik.getFieldProps('agreeToTerms')}
                checked={formik.values.agreeToTerms}
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/seller-policy" className="text-primary-600 hover:text-primary-500">
                  Seller Policy
                </Link>
              </label>
            </div>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Registering...' : 'Register as Seller'}
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After registration, your application will be reviewed by our admin team. 
                You will receive an email once your seller account is approved. This usually takes 1-2 business days.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
