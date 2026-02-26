import { Plus } from 'lucide-react';

export default function EventsPage() {
  return (
    <>
      <div className="os-events-header">
        <h1 className="os-page-title" style={{ marginBottom: 0 }}>
          Events Management
        </h1>
        <button className="os-create-event-btn">
          <Plus size={16} />
          <span>Create Event</span>
        </button>
      </div>

      <div className="os-panel">
        <h3 className="os-panel-title">Active Events</h3>
        <p className="os-panel-subtitle">
          Manage your currently live and upcoming events.
        </p>
        <div className="os-empty-state">
          You don't have any active events right now.
        </div>
      </div>
    </>
  );
}
