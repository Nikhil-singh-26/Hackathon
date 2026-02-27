import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, MapPin, RefreshCw, CheckCircle2, Home } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores allowed'),
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
  const { signup, googleLogin } = useAuth();

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const [locationStatus, setLocationStatus] = useState('idle');
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'user', name: '', username: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const passwordValue = watch('password');
  const selectedRole = watch('role');

  const reverseGeocode = async (lat, lng) => {
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      setAddress(data.display_name || 'Address found at your current coordinates.');
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('Coordinates verified. Exact address lookup unavailable.');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        setLocationStatus('success');
        await reverseGeocode(lat, lng);
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
      // Fallback for demo purposes if geolocation fails
      if (locationStatus === 'error' || locationStatus === 'idle') {
          const confirmManual = window.confirm("Location access failed or not provided. Should we use our default hub (Indore) for your account?");
          if (confirmManual) {
              const indoreCoords = { lat: 22.7196, lng: 75.8577 };
              setCoordinates(indoreCoords);
              setAddress("Indore Hub (Manual Fallback)");
              setLocationStatus('success');
              // We'll proceed in the next submit click after state update
              setIsLoading(false);
              return;
          }
      }

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
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        businessName: data.businessName,
        phone: data.phone,
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError('');
    setIsLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard', { replace: true }), 800);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Google registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setServerError('Google registration failed. Please try again.');
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
        { }
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

        <FloatingInput
          label="Username"
          type="text"
          registration={register('username')}
          error={errors.username?.message}
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

        {(selectedRole === 'vendor' || selectedRole === 'organizer') && (
          <div style={{ marginBottom: 20, padding: '16px', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <MapPin size={18} color="var(--color-primary)" />
              <label className="auth-label" style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main)' }}>
                {selectedRole === 'vendor' ? 'Vendor Headquarters Location' : 'Organizer Hub Location'}
              </label>
            </div>

            {locationStatus !== 'success' && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                {selectedRole === 'vendor'
                  ? 'To help event organizers find your services, we require vendors to share their current location. Local organizers within a 5km radius will see your listing.'
                  : 'To help us connect you with the best local vendors, we require organizers to share their primary event hub location.'}
              </p>
            )}

            {locationStatus !== 'success' ? (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationStatus === 'loading'}
                className={locationStatus === 'loading' ? 'pulse-primary' : ''}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: '1.5px solid var(--glass-border)',
                  color: 'var(--color-text-main)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: locationStatus === 'loading' ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {locationStatus === 'loading' ? (
                  <RefreshCw size={18} className="spin" />
                ) : (
                  <MapPin size={18} />
                )}
                {locationStatus === 'loading' ? 'Acquiring GPS Signal...' : 'Share Built-in GPS Location'}
              </button>
            ) : (
              <div className="address-card">
                <div className="address-icon-box">
                  <Home size={20} />
                </div>
                <div className="address-content">
                  <div className="address-header">
                    <h5>Current Location</h5>
                    <span className="address-tag">Verified</span>
                  </div>
                  <p className="address-text">
                    {address || 'Fetching detailed address...'}
                  </p>
                  <button
                    type="button"
                    className="address-relocate"
                    onClick={() => {
                      setLocationStatus('idle');
                      setCoordinates(null);
                      setAddress('');
                    }}
                  >
                    <RefreshCw size={12} />
                    Change Location
                  </button>
                </div>
              </div>
            )}

            {locationStatus === 'error' && (
              <div className="field-error" style={{ marginTop: 10 }}>
                <AlertCircle size={14} />
                <span>Location access is required for {selectedRole}s.</span>
              </div>
            )}
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
            <Link to="/legal/terms-of-service" className="auth-link" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/legal/privacy-policy" className="auth-link" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
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
        Already have an account?{' '}
        <Link to="/auth/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
