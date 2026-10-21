# UTix Campus Events

UTix is a React single-page application for finding Chitkara University events, booking tickets, and submitting event proposals. The code is split into small components and written with readable names and consistent formatting for learning and presentation.

## Run the project

```bash
npm install
npm run dev
```

Open the local address printed by Vite. The production build can be created with `npm run build`.

## Topics demonstrated

- **HTML, CSS, JavaScript and DOM through React:** semantic page structure, responsive styling, event filtering and browser form events.
- **React components and props:** pages and reusable UI pieces receive only the data and actions they need.
- **Local state:** input values, search dialogs, password visibility and validation messages stay inside the component that uses them.
- **React Router:** the home page, event list, event details, account pages, tickets, contact and proposal pages share a navigation layout without full-page reloads. Protected routes redirect signed-out visitors to sign in.
- **Context API:** `AuthContext` shares the current user and sign-in/sign-out actions across the app.
- **Redux Toolkit:** the events and tickets slices keep shared event and booking state in one store. Ticket actions add and remove bookings.
- **Async state:** `createAsyncThunk` loads `public/events.json`; the UI reports loading and request failure states.
- **Forms and validation:** reusable `Field` and `Select` components, required fields, email-domain validation, matching passwords, duplicate-account checks and sign-in credential checks.
- **Browser persistence:** tickets, the current demo session and demo accounts persist in `localStorage`.
- **Separate organizer portal:** organizer registration and sign-in use their own account store and dedicated routes. Organizers get a dashboard with proposal counts, review statuses and proposal removal. Each proposal is associated with its organizer account.

## Demo account behavior

Create an account with an address ending in `@chitkara.edu.in`. After saving it, UTix sends you to the sign-in page. Sign in with the same email and password to access My Tickets and book an event. Account passwords are stored as browser-generated SHA-256 hashes for this front-end demonstration.

Organizers use the separate **Organizer sign in** and **Organizer account** links in the footer. After registration, sign in at `/organizer/login` to open `/organizer/dashboard`, then create proposals from the dashboard. The status remains Pending review until an administrator workflow is connected.

This is a client-only class project: local browser storage and client-side checks are not production authentication. A real deployment should verify university identity and credentials on a server and store password hashes using a dedicated password-hashing algorithm.

## Project structure

```text
src/
  components/   Shared navigation and event UI
  context/      Signed-in user context
  pages/        Route pages and reusable form fields
  store/        Redux Toolkit store and state slices
  App.jsx       Routes and app-level interactions
  main.jsx      React, Router, Context and Redux providers
public/
  events.json   Event data loaded asynchronously
  assets/       Images used by the interface
```
