import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

import AuthLayout from '../../components/auth/AuthLayout';
import FloatingInput from '../../components/auth/FloatingInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import SubmitButton from '../../components/auth/SubmitButton';
import { useAuth } from '../../hooks/useAuth';

const signupSchema = z
  .object({
    role: z.enum(['user', 'organizer', 'vendor'], {
      required_error: 'Please select an account type',
    }),
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .refine(
        (val) => {
          const domain = val.split('@')[1]?.toLowerCase();
          const allowed = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'live.com'];
          return allowed.includes(domain);
        },
        { message: 'Please use a trusted email provider (e.g. Gmail, Outlook, Yahoo)' }
      ),
    businessName: z.string().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => {
    if (data.role === 'vendor' && (!data.businessName || data.businessName.trim() === '')) {
      return false;
    }
    return true;
  }, {
    message: 'Business name is required for vendors',
    path: ['businessName'],
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'user', name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const passwordValue = watch('password');
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setServerError('');
    setIsLoading(true);
    try {
      await signup({ 
        name: data.name, 
        email: data.email, 
        password: data.password,
        role: data.role,
        businessName: data.businessName,
        phone: data.phone
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 800);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Signup failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Create account"
      subtitle="Join EventFlex and start your journey"
    >
      {serverError && (
        <div className="form-error-banner">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Role Selection */}
        <div style={{ marginBottom: 24 }}>
          <label className="auth-label" style={{ marginBottom: 12, display: 'block', color: 'var(--color-text-main)', fontSize: '0.9rem', fontWeight: 600 }}>I am a:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px',
              border: `1px solid ${selectedRole === 'organizer' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: selectedRole === 'organizer' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
              color: selectedRole === 'organizer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selectedRole === 'organizer' ? 600 : 500,
              boxShadow: selectedRole === 'organizer' ? 'var(--glass-shadow)' : 'none'
            }}>
              <input type="radio" value="organizer" {...register('role')} style={{ display: 'none' }} />
              Organizer
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px',
              border: `1px solid ${selectedRole === 'vendor' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: selectedRole === 'vendor' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
              color: selectedRole === 'vendor' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selectedRole === 'vendor' ? 600 : 500,
              boxShadow: selectedRole === 'vendor' ? 'var(--glass-shadow)' : 'none'
            }}>
              <input type="radio" value="vendor" {...register('role')} style={{ display: 'none' }} />
              Vendor
            </label>
          </div>
          {errors.role && (
            <div className="field-error" style={{ marginTop: 8 }}>
              <AlertCircle size={14} />
              <span>{errors.role.message}</span>
            </div>
          )}
        </div>

        <FloatingInput
          label="Full name"
          type="text"
          registration={register('name')}
          error={errors.name?.message}
        />

        {selectedRole === 'vendor' && (
          <FloatingInput
            label="Business name"
            type="text"
            registration={register('businessName')}
            error={errors.businessName?.message}
          />
        )}

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
          autoComplete="new-password"
        />

        <PasswordStrengthMeter password={passwordValue} />

        <PasswordInput
          label="Confirm password"
          registration={register('confirmPassword')}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <label className="auth-checkbox-label" style={{ marginTop: 12, marginBottom: 20 }}>
          <input
            type="checkbox"
            className="auth-checkbox"
            {...register('terms')}
          />
          <span>
            I agree to the{' '}
            <span className="auth-link" tabIndex={0}>Terms of Service</span>
            {' '}and{' '}
            <span className="auth-link" tabIndex={0}>Privacy Policy</span>
          </span>
        </label>
        {errors.terms && (
          <div className="field-error" style={{ marginTop: -12, marginBottom: 16 }}>
            <AlertCircle size={14} />
            <span>{errors.terms.message}</span>
          </div>
        )}

        <SubmitButton isLoading={isLoading} isSuccess={isSuccess}>
          <span>Create Account</span>
          <ArrowRight size={18} />
        </SubmitButton>
      </form>

      <p className="auth-footer-text">
        Already have an account?{' '}
        <Link to="/auth/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
