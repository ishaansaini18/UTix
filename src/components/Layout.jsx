import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export function Layout({ children, events, user, onLogout }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = query
    ? events.filter(event =>
        `${event.title} ${event.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : [];

  function searchEvent(title) {
    setSearchOpen(false);
    navigate(`/events?q=${encodeURIComponent(title)}`);
  }

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" to="/">
<img className="brand-text" src="/assets/text2.png" alt="UTix" />
<img className="brand-logo" src="/assets/logo.jpeg" alt="Chitkara logo" />
          </Link>

          <div className="nav-links">
            {[
              ['/', 'Home'],
              ['/events', 'Events'],
              ['/#categories', 'Categories'],
              ['/tickets', 'My Tickets'],
              ['/about', 'About Us'],
              ['/contact', 'Contact']
            ].map(([to, label]) => (
              <NavLink
                key={label}
                to={to}
                end={to === '/' || to === '/#categories'}
                className={({ isActive }) =>
                  isActive && to !== '/#categories' ? 'active' : ''
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
            <img src="/assets/search.png" alt="" />
            </button>

            {user ? (
              <button className="nav-btn" onClick={onLogout}>Logout</button>
            ) : (
              <Link className="nav-btn" to="/login">Login</Link>
            )}

            <Link className="nav-btn primary" to="/signup">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>
      <Footer />

      <div
        className={`search-overlay ${searchOpen ? 'open' : ''}`}
        onClick={event => {
          if (event.target === event.currentTarget) setSearchOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Search events"
      >
        <div className="search-modal">
          <div className="search-modal-row">
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={event => setQuery(event.target.value)}
              type="search"
              placeholder="Search all events..."
            />
            <button
              className="small-btn"
              onClick={() => setSearchOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="search-results">
            {results.map(event => (
              <button
                className="search-result"
                key={event.id}
                onClick={() => searchEvent(event.title)}
              >
                <strong>{event.title}</strong>
                <div className="muted">{event.category}</div>
              </button>
            ))}

            {query && !results.length && (
              <div className="search-result muted">No matching events.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/">
             <img className="brand-text" src="/assets/text2.png" alt="UTix" />
              <img className="brand-logo" src="/assets/logo.jpeg" alt="" />
            </Link>
            <p>Chitkara University's campus event discovery and ticket-booking platform.</p>
          </div>

          <div>
            <h4>Explore</h4>
            <Link to="/events">All Events</Link>
            <Link to="/#categories">Categories</Link>
            <Link to="/tickets">My Tickets</Link>
          </div>

          <div>
            <h4>Organizers</h4>
            <Link to="/host">Host an Event</Link>
            <Link to="/contact">Support</Link>
            <Link to="/about">About UTix</Link>
          </div>

          <div>
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/tickets">Bookings</Link>
          </div>
        </div>

        <div className="copyright">
          © 2026 UTix. Built for the Chitkara University community.
        </div>
      </div>
    </footer>
  );
}
