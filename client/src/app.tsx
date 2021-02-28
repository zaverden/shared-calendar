import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider, QueryClient } from "react-query";
import { AppHeader, NotFoundPage } from "@shacal/ui/components";
import { CalendarsListPage } from "./pages/calendars/calendars-list-page";
import { CalendarPage } from "pages/calendars/calendar-page";
import { NewEventPage } from "pages/events/new-event-page";
import { EventPage } from "pages/events/event-page";

function Fake({ title }: { title: string }) {
  const match = useRouteMatch();
  const params = useParams();
  return (
    <div>
      <h2>{title}</h2>
      <pre>{JSON.stringify({ params })}</pre>
      <pre>{JSON.stringify({ match })}</pre>
    </div>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <Link to="/">Home</Link>
      <Link to="/calendar/qqqqqqqqq">Calendar</Link>
      <Link to="/event/eeeeeeeeee">Event</Link>

      <Switch>
        <Route exact path="/">
          <CalendarsListPage />
        </Route>
        <Route exact path="/calendar/:publicId">
          <CalendarPage />
        </Route>
        <Route exact path="/calendar/:publicId/new-event">
          <NewEventPage />
        </Route>
        <Route exact path="/event/:publicId">
          <EventPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

const queryClient = new QueryClient();
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AppHeader />
      <Router />
    </QueryClientProvider>
  );
}
