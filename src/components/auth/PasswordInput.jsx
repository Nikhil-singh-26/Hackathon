import { useState, useCallback } from 'react';
import { Eye, EyeOff, AlertTriangle, XCircle } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  error,
  registration,
  ...props
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleKeyEvent = useCallback((e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsRevealed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsRevealed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsRevealed(false);
  }, []);

  const inputClasses = [
    'floating-input',
    error ? 'has-error' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="floating-input-group">
      <div className="password-input-wrapper">
        <input
          type={isRevealed ? 'text' : 'password'}
          className={inputClasses}
          placeholder=" "
          {...registration}
          onKeyDown={handleKeyEvent}
          onKeyUp={handleKeyEvent}
          autoComplete="current-password"
          {...props}
        />
        <label className="floating-label">{label}</label>

        <button
          type="button"
          className={`password-reveal-btn ${isRevealed ? 'revealing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          tabIndex={-1}
          aria-label={isRevealed ? 'Hide password' : 'Reveal password'}
        >
          {isRevealed ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <span className="password-reveal-hint">Hold to reveal</span>
      </div>

      {capsLockOn && (
        <div className="caps-lock-alert">
          <AlertTriangle size={14} />
          <span>Caps Lock is on</span>
        </div>
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
