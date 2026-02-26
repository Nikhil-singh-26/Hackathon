import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <>
      <h1 className="os-page-title">Analytics</h1>

      <div className="os-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <BarChart3 size={18} style={{ color: '#a78bfa' }} />
          <h3 className="os-panel-title" style={{ marginBottom: 0 }}>
            Performance Overview
          </h3>
        </div>
        <p className="os-panel-subtitle">
          Detailed metrics on ticket sales, attendance, and revenue.
        </p>
        <div className="os-chart-placeholder" style={{ height: 280 }}>
          Detailed charts will render here based on historical data.
        </div>
      </div>
    </>
  );
}
