import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import {
  Home, Events, About, Contact, Host, Login, Signup,
  Tickets, EventDetails, NotFound
} from './pages/Pages';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('utixUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('utixTickets');
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  useEffect(() => {
    fetch('/events.json')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('utixUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('utixUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('utixTickets', JSON.stringify(tickets));
  }, [tickets]);

  function book(event) {
    const alreadyBooked = tickets.some(ticket => ticket.id === event.id);

    if (alreadyBooked) {
      alert('This event is already in My Tickets.');
      return;
    }

    const newTicket = {
      ...event,
      bookingId: 'UTX' + Date.now().toString().slice(-7)
    };

    setTickets([...tickets, newTicket]);
    alert(`Ticket booked for ${event.title}!`);
  }

  function cancel(id) {
    if (window.confirm('Cancel this ticket?')) {
      setTickets(tickets.filter(ticket => ticket.id !== id));
    }
  }

  return (
    <Layout
      events={events}
      user={user}
      onLogout={() => setUser(null)}
    >
      <Routes>
        <Route path="/" element={<Home events={events} book={book} />} />
        <Route path="/events" element={<Events events={events} book={book} />} />
        <Route path="/events/:eventId" element={<EventDetails events={events} book={book} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/host" element={<Host />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute user={user}>
              <Tickets tickets={tickets} cancel={cancel} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
