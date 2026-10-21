import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

export const loadEvents = createAsyncThunk("events/loadEvents", async () => {
  const response = await fetch("/events.json");
  if (!response.ok) {
    throw new Error("The event list could not be loaded.");
  }
  return response.json();
});

const eventsSlice = createSlice({
  name: "events",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

function readSavedTickets() {
  try {
    return JSON.parse(localStorage.getItem("utixTickets")) || [];
  } catch {
    return [];
  }
}

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: readSavedTickets(),
  reducers: {
    addTicket: (state, action) => {
      state.push(action.payload);
    },
    removeTicket: (state, action) =>
      state.filter((ticket) => ticket.id !== action.payload),
  },
});

export const { addTicket, removeTicket } = ticketsSlice.actions;

export const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
    tickets: ticketsSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem("utixTickets", JSON.stringify(store.getState().tickets));
});
