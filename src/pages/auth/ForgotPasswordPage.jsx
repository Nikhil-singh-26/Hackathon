import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

import AuthLayout from '../../components/auth/AuthLayout';
import FloatingInput from '../../components/auth/FloatingInput';
import SubmitButton from '../../components/auth/SubmitButton';
import { forgotPassword } from '../../services/auth';

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heading={isSuccess ? 'Check your email' : 'Forgot password?'}
      subtitle={
        isSuccess
          ? undefined
          : "No worries â€” we'll send you reset instructions"
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
            <Mail size={28} style={{ color: '#22c55e' }} />
          </div>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 8, fontSize: '0.92rem' }}>
            We sent a password reset link to
          </p>
          <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 24 }}>
            {submittedEmail}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: 24 }}>
            Didn&apos;t receive the email?{' '}
            <button
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => setIsSuccess(false)}
            >
              Click to resend
            </button>
          </p>
          <Link to="/auth/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FloatingInput
              label="Email address"
              type="email"
              registration={register('email')}
              error={errors.email?.message}
              validateEmail
            />

            <SubmitButton isLoading={isLoading}>
              <span>Send Reset Link</span>
            </SubmitButton>
          </form>

          <p className="auth-footer-text">
            <Link to="/auth/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} />
              <span>Back to login</span>
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
