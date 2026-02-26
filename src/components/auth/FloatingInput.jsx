import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function FloatingInput({
  label,
  type = 'text',
  error,
  registration,
  validateEmail = false,
  ...props
}) {
  const [isTouched, setIsTouched] = useState(false);
  const [value, setValue] = useState('');

  const isEmailValid = validateEmail && value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isEmailInvalid = validateEmail && isTouched && value && !isEmailValid;

  const handleChange = (e) => {
    setValue(e.target.value);
    registration?.onChange?.(e);
  };

  const handleBlur = (e) => {
    setIsTouched(true);
    registration?.onBlur?.(e);
  };

  const inputClasses = [
    'floating-input',
    error ? 'has-error' : '',
    isEmailValid ? 'is-valid' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="floating-input-group">
      <input
        type={type}
        className={inputClasses}
        placeholder=" "
        {...registration}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete={type === 'email' ? 'email' : 'off'}
        {...props}
      />
      <label className="floating-label">{label}</label>

      {validateEmail && isTouched && value && (
        <span className={`input-status-icon ${isEmailValid ? 'valid' : 'invalid'}`}>
          {isEmailValid ? <CheckCircle size={18} /> : <XCircle size={18} />}
        </span>
      )}

      {error && (
        <div className="field-error">
          <XCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
