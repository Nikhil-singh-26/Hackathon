import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, MapPin } from 'lucide-react';

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
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Geolocation state for vendors
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error
  const [coordinates, setCoordinates] = useState(null); // { lat, lng }
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('success');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('error');
      },
      { enableHighAccuracy: true }
    );
  };

  const onSubmit = async (data) => {
    setServerError('');
    setIsLoading(true);

    if ((selectedRole === 'vendor' || selectedRole === 'organizer') && !coordinates) {
      setServerError(
        selectedRole === 'vendor'
          ? 'Vendors must provide their physical location to be paired with local organizers.'
          : 'Organizers must provide their physical location to discover local vendors.'
      );
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        role: data.role,
        name: data.name,
        email: data.email,
        password: data.password,
        ...(coordinates && { longitude: coordinates.lng, latitude: coordinates.lat })
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>

            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
              border: `1px solid ${selectedRole === 'user' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: selectedRole === 'user' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
              color: selectedRole === 'user' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selectedRole === 'user' ? 600 : 500,
              fontSize: '0.85rem'
            }}>
              <input type="radio" value="user" {...register('role')} style={{ display: 'none' }} />
              User
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
              border: `1px solid ${selectedRole === 'organizer' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: selectedRole === 'organizer' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
              color: selectedRole === 'organizer' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selectedRole === 'organizer' ? 600 : 500,
              fontSize: '0.85rem'
            }}>
              <input type="radio" value="organizer" {...register('role')} style={{ display: 'none' }} />
              Organizer
            </label>

            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
              border: `1px solid ${selectedRole === 'vendor' ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: selectedRole === 'vendor' ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease',
              color: selectedRole === 'vendor' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: selectedRole === 'vendor' ? 600 : 500,
              fontSize: '0.85rem'
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

        <FloatingInput
          label="Email address"
          type="email"
          registration={register('email')}
          error={errors.email?.message}
          validateEmail
        />

        {(selectedRole === 'vendor' || selectedRole === 'organizer') && (
          <div style={{ marginBottom: 20, padding: '16px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MapPin size={18} color="var(--color-primary)" />
              <label className="auth-label" style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main)' }}>
                {selectedRole === 'vendor' ? 'Vendor Headquarters Location' : 'Organizer Hub Location'}
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
              {selectedRole === 'vendor'
                ? 'To help event organizers find your services, we require vendors to share their current location. Local organizers within a 5km radius will see your listing.'
                : 'To help us connect you with the best local vendors, we require organizers to share their primary event hub location.'}
            </p>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === 'success' || locationStatus === 'loading'}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: locationStatus === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                border: `1px solid ${locationStatus === 'success' ? '#22c55e' : 'var(--glass-border)'}`,
                color: locationStatus === 'success' ? '#22c55e' : 'var(--color-text-main)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: (locationStatus === 'success' || locationStatus === 'loading') ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              {locationStatus === 'idle' && 'Share Built-in GPS Location'}
              {locationStatus === 'loading' && 'Acquiring GPS Signal...'}
              {locationStatus === 'success' && '✓ Location Verified'}
              {locationStatus === 'error' && '✗ Error Grabbing GPS - Try Again'}
            </button>
          </div>
        )}

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
