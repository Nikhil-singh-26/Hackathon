import { useMemo } from 'react';
import { Check } from 'lucide-react';

const REQUIREMENTS = [
  { key: 'length', label: '8+ characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'Uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'Number', test: (v) => /[0-9]/.test(v) },
  { key: 'special', label: 'Special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const getStrength = (score) => {
  if (score <= 1) return { level: 'weak', label: 'Weak' };
  if (score <= 2) return { level: 'fair', label: 'Fair' };
  if (score <= 3) return { level: 'good', label: 'Good' };
  return { level: 'strong', label: 'Strong' };
};

export default function PasswordStrengthMeter({ password = '' }) {
  const analysis = useMemo(() => {
    const results = REQUIREMENTS.map((req) => ({
      ...req,
      met: req.test(password),
    }));
    const score = results.filter((r) => r.met).length;
    return { results, score, ...getStrength(score) };
  }, [password]);

  if (!password) return null;

  return (
    <div className="password-strength">
      {}
      <div className="strength-bar-track">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={[
              'strength-bar-segment',
              analysis.score >= seg ? `filled ${analysis.level}` : '',
            ].filter(Boolean).join(' ')}
          />
        ))}
      </div>

      <div className={`strength-label ${analysis.level}`}>
        {analysis.label}
      </div>

      {}
      <div className="strength-requirements">
        {analysis.results.map((req) => (
          <div key={req.key} className={`strength-req ${req.met ? 'met' : ''}`}>
            <span className="strength-req-icon">
              {req.met && <Check size={10} strokeWidth={3} />}
            </span>
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
