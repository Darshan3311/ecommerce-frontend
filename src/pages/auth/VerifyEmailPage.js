import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        toast.error('Invalid verification link');
        return;
      }

      try {
        await AuthService.verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loading />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Verifying your email...
            </h2>
            <p className="mt-2 text-gray-600">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600">
              Your email has been successfully verified. Redirecting to login...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 btn btn-primary"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
