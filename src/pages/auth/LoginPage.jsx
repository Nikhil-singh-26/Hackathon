import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

import AuthLayout from '../../components/auth/AuthLayout';
import FloatingInput from '../../components/auth/FloatingInput';
import PasswordInput from '../../components/auth/PasswordInput';
import SubmitButton from '../../components/auth/SubmitButton';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});



export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setIsLoading(true);
    try {
      await login(data);
      setIsSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError('');
    setIsLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      setIsSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 800);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Google login failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setServerError('Google login failed. Please try again.');
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subtitle="Sign in to your EventFlex account"
    >
      {serverError && (
        <div className="form-error-banner">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FloatingInput
          label="Email address"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
          validateEmail
        />

        <PasswordInput
          label="Password"
          registration={register('password')}
          error={errors.password?.message}
        />

        <div className="auth-form-row">
          <label className="auth-checkbox-label">
            <input type="checkbox" className="auth-checkbox" />
            <span>Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <SubmitButton isLoading={isLoading} isSuccess={isSuccess}>
          <span>Sign In</span>
          <ArrowRight size={18} />
        </SubmitButton>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 12 }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          shape="pill"
          width="100%"
        />
      </div>

      <p className="auth-footer-text">
        Don&apos;t have an account?{' '}
        <Link to="/auth/signup" className="auth-link">
          Create one
        </Link>
      </p>


    </AuthLayout>
  );
}
