import { Plus, X, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [events, setEvents] = useState([]);

  const handleCreate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = Object.fromEntries(formData.entries());
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setIsCreating(false);
  };

  return (
    <>
      <div className="os-events-header">
        <h1 className="os-page-title" style={{ marginBottom: 0 }}>
          Events Management
        </h1>
        <button
          className="os-create-event-btn"
          onClick={() => setIsCreating(!isCreating)}
          style={isCreating ? {
            background: 'var(--color-surface-dark)',
            color: 'var(--color-text-main)',
            boxShadow: 'none'
          } : {}}
        >
          {isCreating ? <X size={16} /> : <Plus size={16} />}
          <span>{isCreating ? 'Cancel' : 'Create Event'}</span>
        </button>
      </div>

      {isCreating ? (
        <div className="os-panel animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="os-settings-section">
            <h3>Create New Event</h3>
            <p>Fill in the details below to start planning your event.</p>
            <form onSubmit={handleCreate}>
              <div className="os-form-group">
                <label className="os-form-label">Event Name</label>
                <input name="name" type="text" className="os-form-input" placeholder="e.g. Annual Tech Conference" required />
              </div>
              <div className="os-form-group">
                <label className="os-form-label">Date</label>
                <input name="date" type="date" className="os-form-input" required />
              </div>
              <div className="os-form-group">
                <label className="os-form-label">Estimated Budget (in INR)</label>
                <input name="budget" type="number" className="os-form-input" placeholder="e.g. 50000" required />
              </div>
              <button type="submit" className="os-save-btn">Create Event</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="os-panel animate-in fade-in duration-300">
          <h3 className="os-panel-title">Active Events</h3>
          <p className="os-panel-subtitle">
            Manage your currently live and upcoming events.
          </p>

          {events.length === 0 ? (
            <div className="os-empty-state">
              You don't have any active events right now.
            </div>
          ) : (
            <div className="os-activity-list" style={{ marginTop: '20px' }}>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="os-activity-item"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'var(--color-surface-dark)',
                    border: 'var(--glass-border)'
                  }}
                >
                  <div className="os-activity-avatar flex items-center justify-center">
                    <Calendar size={18} color="white" />
                  </div>
                  <div className="os-activity-info">
                    <strong>{ev.name}</strong>
                    <span>Date: {ev.date}</span>
                  </div>
                  <div className="os-activity-amount" style={{ color: 'var(--color-accent)' }}>
                    ₹{parseInt(ev.budget).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
