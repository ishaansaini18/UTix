import { useContext, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  EmptyEvents,
  EventCard,
  EventSearch,
  formatDate,
} from "../components/EventUI";
import { AuthContext } from "../context/AuthContext";

const initialFilters = {
  query: "",
  category: "All Categories",
  date: "",
};

function filterEvents(events, filters) {
  return events.filter((event) => {
    const matchesText =
      !filters.query ||
      `${event.title} ${event.category} ${event.description}`
        .toLowerCase()
        .includes(filters.query.toLowerCase());

    const matchesCategory =
      filters.category === "All Categories" ||
      event.category === filters.category;

    const matchesDate = !filters.date || event.date === filters.date;

    return matchesText && matchesCategory && matchesDate;
  });
}

function PageHero({ kicker, title, children }) {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="section-kicker">{kicker}</span>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function Home({ events, book }) {
  const [filters, setFilters] = useState(initialFilters);
  const filtered = filterEvents(events, filters);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Chitkara University Events</span>
            <h1>
              Experience. Engage. Excel. Only at{" "}
              <span className="red">Chitkara.</span>
            </h1>
            <p>
              Discover cultural, technical, sports and entertainment events.
              Book tickets, manage registrations and keep every campus
              experience in one place.
            </p>

            <div className="hero-buttons">
              <Link className="btn primary" to="/events">
                Explore Events
              </Link>
              <Link className="btn" to="/host">
                Host an Event
              </Link>
            </div>

            <EventSearch
              filters={filters}
              setFilters={setFilters}
              buttonText="Search Events"
            />
          </div>
        </div>
      </section>

      <section className="section" id="events">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Featured events</span>
              <h2>What is happening next</h2>
            </div>
            <Link className="btn" to="/events">
              View all events
            </Link>
          </div>

          <div className="grid event-grid">
            {filtered.length ? (
              filtered
                .slice(0, 6)
                .map((event) => (
                  <EventCard key={event.id} event={event} onBook={book} />
                ))
            ) : (
              <EmptyEvents />
            )}
          </div>
        </div>
      </section>

      <section className="section alt" id="categories">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-kicker">Find your vibe</span>
              <h2>Browse by category</h2>
            </div>
            <p>
              From coding marathons to cultural nights, discover activities that
              match your interests.
            </p>
          </div>

          <div className="grid category-grid">
            {[
              [
                "💻",
                "Technical",
                "Hackathons, coding contests and innovation showcases.",
              ],
              [
                "🎭",
                "Cultural",
                "Music, dance, theatre, literature and campus celebrations.",
              ],
              [
                "🏆",
                "Sports",
                "Tournaments, fitness challenges and team competitions.",
              ],
              [
                "🧠",
                "Workshops",
                "Hands-on learning with mentors, creators and industry experts.",
              ],
            ].map(([icon, name, copy]) => (
              <Link
                className="category-card"
                key={name}
                to={`/events?q=${name.toLowerCase()}`}
              >
                <div className="category-icon">{icon}</div>
                <h3>{name}</h3>
                <p>{copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid stats">
            {[
              ["50+", "Campus events"],
              ["4K+", "Student bookings"],
              ["30+", "Student clubs"],
              ["100%", "Digital tickets"],
            ].map(([number, label]) => (
              <div className="stat" key={label}>
                <strong>{number}</strong>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-box">
          <div>
            <span className="section-kicker">Bring your idea alive</span>
            <h2>Planning a campus event?</h2>
            <p className="muted">
              Submit your proposal and let UTix help students discover it.
            </p>
          </div>
          <Link className="btn primary" to="/host">
            Host an Event
          </Link>
        </div>
      </section>
    </>
  );
}

export function Events({ events, book }) {
  const [params] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    query: params.get("q") || "",
  });

  const filtered = filterEvents(events, filters);

  return (
    <>
      <PageHero kicker="Discover campus life" title="Explore Events">
        <p>
          Search upcoming technical, cultural, sports and workshop events, then
          book your ticket instantly.
        </p>
      </PageHero>

      <section className="section">
        <div className="container">
          <EventSearch filters={filters} setFilters={setFilters} />
          <div className="grid event-grid" style={{ marginTop: 30 }}>
            {filtered.length ? (
              filtered.map((event) => (
                <EventCard key={event.id} event={event} onBook={book} />
              ))
            ) : (
              <EmptyEvents />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function EventDetails({ events, book }) {
  const { eventId } = useParams();
  const event = events.find((item) => item.id === eventId);

  if (!event) return <NotFound />;

  return (
    <section className="section">
      <div className="container">
        <article className="panel about-wrap">
          <span className="section-kicker">{event.category}</span>
          <h1
            style={{ fontSize: "clamp(2.4rem,5vw,4.5rem)", margin: "12px 0" }}
          >
            {event.title}
          </h1>
          <p>{event.description}</p>
          <p>
            <strong>
              {formatDate(event.date)} • {event.time} • {event.venue}
            </strong>
          </p>
          <button className="btn primary" onClick={() => book(event)}>
            Book Ticket
          </button>
        </article>
      </div>
    </section>
  );
}

export function About() {
  return (
    <>
      <PageHero kicker="Our platform" title="About UTix">
        <p>
          One destination for discovering, booking and managing Chitkara
          University campus experiences.
        </p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="panel about-wrap">
            <p>
              UTix is a campus event discovery and ticket-booking platform
              designed for the Chitkara University community.
            </p>
            <p>
              It brings technical, cultural, sports and entertainment events
              together in one convenient place. Students can discover upcoming
              events, view complete event details, check availability, book
              tickets and access their registrations from one platform.
            </p>
            <p>
              Event organizers can submit event proposals, manage attendee
              interest and communicate event information. Administrators can
              review listings and maintain an organized campus event ecosystem.
            </p>
            <p>
              Our goal is to replace scattered announcements and manual
              registrations with a simple, fast and reliable digital experience.
            </p>
            <p>
              <strong className="red">
                Discover. Book. Experience. — All with UTix.
              </strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function StoredForm({ kind, title, children }) {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem(kind);
    return saved ? JSON.parse(saved) : [];
  });
  const [done, setDone] = useState(false);

  function submit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newRecord = {
      ...Object.fromEntries(formData),
      ...(kind === "utixHostRequests" ? { ownerEmail: user?.email } : {}),
      ...(kind === "utixHostRequests" ? { status: "Pending review" } : {}),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const updatedRecords = [...records, newRecord];

    setRecords(updatedRecords);
    localStorage.setItem(kind, JSON.stringify(updatedRecords));
    event.currentTarget.reset();
    setDone(true);
  }

  return (
    <section className="panel">
      <h2>{title}</h2>
      {children(submit, done)}
    </section>
  );
}

export function Contact() {
  return (
    <>
      <PageHero
        kicker="Get in touch"
        title={
          <>
            Contact <span className="red">UTix</span>
          </>
        }
      >
        <p>
          Need help with an event, booking, payment or registration? Send us a
          message.
        </p>
      </PageHero>

      <section className="section">
        <div className="container form-layout">
          <div>
            <h2 style={{ fontSize: "2.3rem" }}>We are here to help</h2>
            <p className="muted" style={{ marginTop: 10 }}>
              The UTix support team will respond to event and ticket-related
              queries.
            </p>

            <div className="grid contact-cards">
              {[
                ["✉ Email", "support@utix.in"],
                ["☎ Phone", "+91 98765 43210"],
                ["📍 Visit", "Chitkara University, Punjab"],
                ["◷ Hours", "Mon–Sat, 9 AM–6 PM"],
              ].map(([head, text]) => (
                <div className="contact-card" key={head}>
                  <h3>{head}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <StoredForm kind="utixMessages" title="Send a message">
            {(submit, done) => (
              <form className="form" onSubmit={submit}>
                <div className="form-row">
                  <Field label="Full name" name="name" required />
                  <Field
                    label="University email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="form-row">
                  <Field label="Phone number" name="phone" type="tel" />
                  <Select
                    label="Enquiry type"
                    name="category"
                    options={[
                      "Ticket Booking",
                      "Event Information",
                      "Payment Issue",
                      "Host an Event",
                      "Other",
                    ]}
                  />
                </div>
                <Field label="Subject" name="subject" required />
                <Field label="Message" name="message" textarea required />
                <button className="btn primary">Send Message</button>
                {done && (
                  <p className="status show">
                    Your message has been sent successfully.
                  </p>
                )}
              </form>
            )}
          </StoredForm>
        </div>
      </section>
    </>
  );
}

function Field({ label, textarea, ...props }) {
  return (
    <div className="field">
      <label htmlFor={props.name}>{label}</label>
      {textarea ? (
        <textarea id={props.name} {...props} />
      ) : (
        <input id={props.name} {...props} />
      )}
    </div>
  );
}

function Select({ label, name, options }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} required>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export function Host() {
  return (
    <>
      <PageHero kicker="For organizers" title="Host an Event">
        <p>
          Submit a proposal and track its review status in your organizer
          dashboard.
        </p>
      </PageHero>

      <section className="section">
        <div className="container form-layout">
          <div>
            <h2 style={{ fontSize: "2.4rem" }}>
              Turn your plan into a campus experience
            </h2>
            <div className="feature-list">
              {[
                "Provide accurate event information and organizer details.",
                "UTix administrators review your proposal.",
                "Approved events become visible to students.",
              ].map((text, index) => (
                <div className="feature-item" key={text}>
                  <span>{index + 1}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <StoredForm kind="utixHostRequests" title="">
            {(submit, done) => (
              <form className="form" onSubmit={submit}>
                <div className="form-row">
                  <Field label="Event title" name="title" required />
                  <Select
                    label="Category"
                    name="category"
                    options={["Technical", "Cultural", "Sports", "Workshops"]}
                  />
                </div>
                <div className="form-row">
                  <Field label="Date" name="date" type="date" required />
                  <Field label="Time" name="time" type="time" required />
                </div>
                <Field label="Venue" name="venue" required />
                <div className="form-row">
                  <Field label="Organizer name" name="organizer" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <Field
                  label="Description"
                  name="description"
                  textarea
                  required
                />
                <button className="btn primary">Submit Proposal</button>
                {done && (
                  <p className="status show">
                    Event proposal submitted for admin approval.
                  </p>
                )}
              </form>
            )}
          </StoredForm>
        </div>
      </section>
    </>
  );
}

export function OrganizerDashboard() {
  const { user } = useContext(AuthContext);
  const [proposals, setProposals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("utixHostRequests")) || [];
    } catch {
      return [];
    }
  });
  const mine = proposals.filter((proposal) => proposal.ownerEmail === user.email);
  const pendingCount = mine.filter(
    (proposal) => proposal.status === "Pending review",
  ).length;
  const approvedCount = mine.filter(
    (proposal) => proposal.status === "Approved",
  ).length;

  function removeProposal(id) {
    if (!window.confirm("Remove this event proposal?")) return;
    const updated = proposals.filter((proposal) => proposal.id !== id);
    setProposals(updated);
    localStorage.setItem("utixHostRequests", JSON.stringify(updated));
  }

  return (
    <>
      <PageHero kicker="Organizer workspace" title="Your dashboard">
        <p>
          Welcome, {user.name}. Create event proposals and keep track of their
          review status here.
        </p>
      </PageHero>

      <section className="section">
        <div className="container organizer-dashboard">
          <div className="dashboard-heading">
            <div>
              <span className="section-kicker">Overview</span>
              <h2>Your events at a glance</h2>
            </div>
            <Link className="btn primary" to="/host">
              + Create event proposal
            </Link>
          </div>

          <div className="dashboard-stats">
            <article className="dashboard-stat">
              <span>Total proposals</span>
              <strong>{mine.length}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Pending review</span>
              <strong>{pendingCount}</strong>
            </article>
            <article className="dashboard-stat">
              <span>Approved</span>
              <strong>{approvedCount}</strong>
            </article>
          </div>

          <div className="dashboard-heading proposal-heading">
            <div>
              <span className="section-kicker">Event management</span>
              <h2>Your proposals</h2>
            </div>
          </div>

          {mine.length ? (
            <div className="proposal-list">
              {mine.map((proposal) => (
                <article className="proposal-card" key={proposal.id}>
                  <div className="proposal-main">
                    <span className="proposal-category">
                      {proposal.category}
                    </span>
                    <h3>{proposal.title}</h3>
                    <p className="muted">
                      {proposal.date} · {proposal.time} · {proposal.venue}
                    </p>
                    <p className="muted">{proposal.description}</p>
                  </div>
                  <div className="proposal-actions">
                    <span
                      className={`proposal-status ${proposal.status === "Approved" ? "approved" : "pending"}`}
                    >
                      {proposal.status || "Pending review"}
                    </span>
                    {proposal.status !== "Approved" && (
                      <button
                        className="small-btn secondary-btn"
                        onClick={() => removeProposal(proposal.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>No proposals yet</h3>
              <p>Start by sharing your next campus event with students.</p>
              <Link className="btn primary dashboard-empty-action" to="/host">
                Create your first proposal
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function Auth({ signup }) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  async function submit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const email = data.email.trim().toLowerCase();

    if (!email.endsWith("@chitkara.edu.in")) {
      setMessage("Use your Chitkara email address ending in @chitkara.edu.in.");
      return;
    }

    let accounts = [];
    try {
      accounts = JSON.parse(localStorage.getItem("utixAccounts")) || [];
    } catch {
      accounts = [];
    }

    if (signup) {
      if (data.password !== data.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      if (accounts.some((account) => account.email === email)) {
        setMessage(
          "An account with this email already exists. Please sign in.",
        );
        return;
      }

      accounts.push({
        email,
        passwordHash: await hashPassword(data.password),
        name: data.fullName.trim(),
      });
      localStorage.setItem("utixAccounts", JSON.stringify(accounts));
      setMessage("Account created. Redirecting you to sign in…");
      window.setTimeout(() => navigate("/login", { replace: true }), 700);
      return;
    }

    const passwordHash = await hashPassword(data.password);
    const account = accounts.find(
      (savedAccount) =>
        savedAccount.email === email &&
        savedAccount.passwordHash === passwordHash,
    );
    if (!account) {
      setMessage(
        "Email or password is incorrect. Create an account first if you are new.",
      );
      return;
    }

    signIn({ name: account.name, email: account.email });
    setMessage("Sign-in successful. Redirecting…");
    window.setTimeout(() => navigate("/tickets", { replace: true }), 700);
  }

  return (
    <section className="auth-page">
      <section className="panel auth-box">
        <span className="section-kicker">
          {signup ? "Join UTix" : "Welcome back"}
        </span>
        <h1>
          {signup ? (
            "Create your account"
          ) : (
            <>
              Login to <span className="red">UTix</span>
            </>
          )}
        </h1>
        <p>
          {signup
            ? "Register and never miss a campus event."
            : "Access your bookings and registrations."}
        </p>

        <form className="form" onSubmit={submit}>
          {signup && <Field label="Full name" name="fullName" required />}

          <Field
            label="University email"
            name="email"
            type="email"
            placeholder="name@chitkara.edu.in"
            pattern=".+@chitkara\.edu\.in"
            title="Enter an email address ending in @chitkara.edu.in"
            required
          />

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                minLength="6"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShow(!show)}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {signup && (
            <Field
              label="Confirm password"
              name="confirmPassword"
              type="password"
              minLength="6"
              required
            />
          )}

          <button className="btn primary">
            {signup ? "Create Account" : "Login"}
          </button>

          {message && (
            <p className="status show" role="status">
              {message}
            </p>
          )}

          <p className="center-note">
            {signup ? (
              <>
                Already registered? <Link to="/login">Log in</Link>
              </>
            ) : (
              <>
                Do not have an account? <Link to="/signup">Create account</Link>
              </>
            )}
          </p>
        </form>
      </section>
    </section>
  );
}

function OrganizerAuth({ signup }) {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const email = data.email.trim().toLowerCase();

    if (!email.endsWith("@chitkara.edu.in")) {
      setMessage("Use your Chitkara email address ending in @chitkara.edu.in.");
      return;
    }

    let accounts = [];
    try {
      accounts = JSON.parse(localStorage.getItem("utixOrganizerAccounts")) || [];
    } catch {
      accounts = [];
    }

    if (signup) {
      if (data.password !== data.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      if (accounts.some((account) => account.email === email)) {
        setMessage("An organizer account already exists for this email.");
        return;
      }

      accounts.push({
        email,
        name: data.fullName.trim(),
        organization: data.organization.trim(),
        passwordHash: await hashPassword(data.password),
      });
      localStorage.setItem("utixOrganizerAccounts", JSON.stringify(accounts));
      setMessage("Organizer account created. Sending you to organizer sign in…");
      window.setTimeout(
        () => navigate("/organizer/login", { replace: true }),
        700,
      );
      return;
    }

    const passwordHash = await hashPassword(data.password);
    const account = accounts.find(
      (savedAccount) =>
        savedAccount.email === email &&
        savedAccount.passwordHash === passwordHash,
    );
    if (!account) {
      setMessage("Organizer email or password is incorrect.");
      return;
    }

    signIn(
      {
        email: account.email,
        name: account.name,
        organization: account.organization,
      },
      "organizer",
    );
    navigate("/organizer/dashboard", { replace: true });
  }

  return (
    <section className="auth-page">
      <section className="panel auth-box">
        <span className="section-kicker">Organizer portal</span>
        <h1>{signup ? "Create an organizer account" : "Organizer sign in"}</h1>
        <p>
          {signup
            ? "Set up a separate account to submit and manage campus event proposals."
            : "Sign in to manage your event proposals."}
        </p>
        <form className="form" onSubmit={submit}>
          {signup && (
            <>
              <Field label="Your name" name="fullName" required />
              <Field label="Club or organization" name="organization" required />
            </>
          )}
          <Field
            label="Chitkara email"
            name="email"
            type="email"
            placeholder="organizer@chitkara.edu.in"
            pattern=".+@chitkara\.edu\.in"
            title="Enter an email address ending in @chitkara.edu.in"
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            minLength="6"
            required
          />
          {signup && (
            <Field
              label="Confirm password"
              name="confirmPassword"
              type="password"
              minLength="6"
              required
            />
          )}
          <button className="btn primary">
            {signup ? "Create organizer account" : "Sign in as organizer"}
          </button>
          {message && (
            <p className="status show" role="status">
              {message}
            </p>
          )}
          <p className="center-note">
            {signup ? (
              <>Already registered? <Link to="/organizer/login">Sign in</Link></>
            ) : (
              <>New organizer? <Link to="/organizer/signup">Create an account</Link></>
            )}
          </p>
          <p className="center-note">
            Looking for student access? <Link to="/login">Student sign in</Link>
          </p>
        </form>
      </section>
    </section>
  );
}

export function Login() {
  return <Auth />;
}

export function Signup() {
  return <Auth signup />;
}

export function OrganizerLogin() {
  return <OrganizerAuth />;
}

export function OrganizerSignup() {
  return <OrganizerAuth signup />;
}

export function Tickets({ tickets, cancel }) {
  return (
    <>
      <PageHero kicker="Your bookings" title="My Tickets">
        <p>
          All tickets booked on this browser are stored here. This front-end
          demo uses local storage.
        </p>
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="ticket-list">
            {tickets.length ? (
              tickets.map((ticket) => (
                <article className="ticket-card" key={ticket.bookingId}>
                  <div className="ticket-date">
                    {formatDate(ticket.date).replace(" ", "\n")}
                  </div>
                  <div>
                    <h3>{ticket.title}</h3>
                    <p className="muted">
                      {ticket.time} • {ticket.venue}
                    </p>
                    <p style={{ fontSize: ".75rem", color: "#ff767c" }}>
                      Booking ID: {ticket.bookingId}
                    </p>
                  </div>
                  <button
                    className="small-btn"
                    onClick={() => cancel(ticket.id)}
                  >
                    Cancel
                  </button>
                </article>
              ))
            ) : (
              <div className="empty">
                <h3>No tickets yet</h3>
                <p>Book an event and it will appear here.</p>
                <Link
                  className="btn primary"
                  style={{ marginTop: 18 }}
                  to="/events"
                >
                  Explore Events
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="empty">
          <h1>404</h1>
          <p>This page could not be found.</p>
          <Link className="btn primary" to="/">
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
