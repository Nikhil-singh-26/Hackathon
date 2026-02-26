import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import SubmitButton from '../../components/auth/SubmitButton';
import { resetPassword } from '../../services/auth';

const schema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      setServerError('Invalid or missing reset token. Please request a new link.');
      return;
    }
    setServerError('');
    setIsLoading(true);
    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Reset failed. The link may have expired.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        heading="Invalid Link"
        subtitle="This password reset link is invalid or has expired"
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertCircle size={28} style={{ color: '#ef4444' }} />
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: '0.92rem' }}>
            Please request a new password reset link.
          </p>
          <Link to="/auth/forgot-password" className="auth-link">
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading={isSuccess ? 'Password reset!' : 'Set new password'}
      subtitle={
        isSuccess
          ? undefined
          : 'Your new password must be different from previous passwords'
      }
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <ShieldCheck size={28} style={{ color: '#22c55e' }} />
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
          <Link
            to="/auth/login"
            className="auth-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </Link>
        </div>
      ) : (
        <>
          {serverError && (
            <div className="form-error-banner">
              <AlertCircle size={18} />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <PasswordInput
              label="New password"
              registration={register('password')}
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <PasswordStrengthMeter password={passwordValue} />

            <PasswordInput
              label="Confirm new password"
              registration={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <SubmitButton isLoading={isLoading} isSuccess={isSuccess}>
              <span>Reset Password</span>
            </SubmitButton>
          </form>

          <p className="auth-footer-text">
            <Link
              to="/auth/login"
              className="auth-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={14} />
              <span>Back to login</span>
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
