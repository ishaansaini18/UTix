import { Link } from 'react-router-dom';

export function money(price) {
  return price === 0 ? 'Free' : `₹${price}`;
}

export function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function EventCard({ event, onBook }) {
  return (
    <article className="event-card">
      <div className={`event-visual ${event.class}`}>
        <span className="badge">{event.category}</span>
        {event.icon}
      </div>

      <div className="event-body">
        <h3>{event.title}</h3>
        <div className="meta">
          <span>📅 {formatDate(event.date)} • {event.time}</span>
          <span>📍 {event.venue}</span>
        </div>
        <p className="muted" style={{ fontSize: '.84rem', marginBottom: 15 }}>
          {event.description}
        </p>

        <div className="card-actions">
          <span className="price">{money(event.price)}</span>
          <button className="small-btn" onClick={() => onBook(event)}>
            Book Ticket
          </button>
        </div>
      </div>
    </article>
  );
}

export function EventSearch({ filters, setFilters, buttonText = 'Filter Events' }) {
  return (
    <form className="search-panel" onSubmit={event => event.preventDefault()}>
      <input
        value={filters.query}
        onChange={event => setFilters({ ...filters, query: event.target.value })}
        type="search"
        placeholder="Search events"
        aria-label="Search events"
      />

      <select
        value={filters.category}
        onChange={event => setFilters({ ...filters, category: event.target.value })}
        aria-label="Event category"
      >
        <option>All Categories</option>
        {['Technical', 'Cultural', 'Sports', 'Workshops'].map(category => (
          <option key={category}>{category}</option>
        ))}
      </select>

      <input
        value={filters.date}
        onChange={event => setFilters({ ...filters, date: event.target.value })}
        type="date"
        aria-label="Event date"
      />

      <button>{buttonText}</button>
    </form>
  );
}

export function EmptyEvents() {
  return (
    <div className="empty" style={{ gridColumn: '1/-1' }}>
      No events match your search.
    </div>
  );
}
