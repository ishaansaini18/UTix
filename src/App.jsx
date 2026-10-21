import { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./context/AuthContext";
import { loadEvents, removeTicket, addTicket } from "./store/store";
import { Layout } from "./components/Layout";
import {
  About,
  Contact,
  EventDetails,
  Events,
  Home,
  Host,
  Login,
  NotFound,
  OrganizerDashboard,
  OrganizerLogin,
  OrganizerSignup,
  Signup,
  Tickets,
} from "./pages/Pages";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user?.role === "student" ? children : <Navigate to="/login" replace />;
}

function OrganizerRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user?.role === "organizer" ? (
    children
  ) : (
    <Navigate to="/organizer/login" replace />
  );
}

export default function App() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.items);
  const status = useSelector((state) => state.events.status);
  const tickets = useSelector((state) => state.tickets);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  function book(event) {
    if (user?.role !== "student") {
      window.alert(
        "Please sign in with your student Chitkara account to book a ticket.",
      );
      return;
    }

    if (tickets.some((ticket) => ticket.id === event.id)) {
      window.alert("This event is already in My Tickets.");
      return;
    }

    dispatch(
      addTicket({
        ...event,
        bookingId: `UTX${Date.now().toString().slice(-7)}`,
      }),
    );
    window.alert(`Ticket booked for ${event.title}!`);
  }

  function cancel(ticketId) {
    if (window.confirm("Cancel this ticket?")) {
      dispatch(removeTicket(ticketId));
    }
  }

  return (
    <Layout events={events} user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Home events={events} book={book} />} />
        <Route
          path="/events"
          element={<Events events={events} book={book} />}
        />
        <Route
          path="/events/:eventId"
          element={<EventDetails events={events} book={book} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/organizer/login" element={<OrganizerLogin />} />
        <Route path="/organizer/signup" element={<OrganizerSignup />} />
        <Route
          path="/organizer/dashboard"
          element={
            <OrganizerRoute>
              <OrganizerDashboard />
            </OrganizerRoute>
          }
        />
        <Route
          path="/host"
          element={
            <OrganizerRoute>
              <Host />
            </OrganizerRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets tickets={tickets} cancel={cancel} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {status === "loading" && (
        <p className="loading-note" role="status">
          Loading events…
        </p>
      )}
      {status === "failed" && (
        <p className="error-note" role="alert">
          Event listings could not be loaded. Please refresh the page and try
          again.
        </p>
      )}
    </Layout>
  );
}
