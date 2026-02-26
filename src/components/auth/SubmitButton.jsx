import { CheckCircle } from 'lucide-react';

export default function SubmitButton({
  children,
  isLoading = false,
  isSuccess = false,
  disabled = false,
  ...props
}) {
  const className = [
    'auth-submit-btn',
    isSuccess ? 'success' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="submit"
      className={className}
      disabled={disabled || isLoading || isSuccess}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner" />
          <span>Processingâ€¦</span>
        </>
      ) : isSuccess ? (
        <>
          <span className="btn-checkmark">
            <CheckCircle size={20} />
          </span>
          <span>Success!</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
