import { DollarSign, CalendarDays, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import OrganizerDashboard from './OrganizerDashboard';
import VendorDashboard from './VendorDashboard';

const STATS = [
  {
    label: 'Total Revenue',
    value: 'â‚¹45,231.89',
    change: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    label: 'Active Events',
    value: '+12',
    change: '+2 since last month',
    icon: CalendarDays,
  },
  {
    label: 'Total Attendees',
    value: '+12,234',
    change: '+19% from last month',
    icon: Users,
  },
  {
    label: 'Active Vendors',
    value: '573',
    change: '+201 since last week',
    icon: TrendingUp,
  },
];

const RECENT_ACTIVITY = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+â‚¹1,999.00' },
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+â‚¹1,999.00' },
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+â‚¹1,999.00' },
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+â‚¹1,999.00' },
];

export default function OverviewPage() {
  const { user } = useAuth();

  if (user?.role === 'organizer') {
    return <OrganizerDashboard />;
  }

  if (user?.role === 'vendor') {
    return <VendorDashboard />;
  }

  return (
    <>
      <h1 className="os-page-title">Overview</h1>

      {}
      <div className="os-stats-grid">
        {STATS.map((stat, i) => (
          <div key={i} className="os-stat-card">
            <div className="os-stat-card-header">
              <h4>{stat.label}</h4>
              <stat.icon size={16} className="os-stat-icon" />
            </div>
            <div className="os-stat-value">{stat.value}</div>
            <div className="os-stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      {}
      <div className="os-overview-grid">
        <div className="os-panel">
          <h3 className="os-panel-title">Overview</h3>
          <div className="os-chart-placeholder">
            Chart Data Visualization
          </div>
        </div>

        <div className="os-panel">
          <div className="os-activity-header">
            <h3>Recent Activity</h3>
            <p>You made 265 sales this month.</p>
          </div>
          <div className="os-activity-list">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="os-activity-item">
                <div className="os-activity-avatar" />
                <div className="os-activity-info">
                  <strong>{item.name}</strong>
                  <span>{item.email}</span>
                </div>
                <span className="os-activity-amount">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
