import React, { Fragment } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { AppHeader } from "@shacal/ui/components";
import { CalendarsListPage } from "./pages/calendars/calendars-list-page";

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
          <Fake title="calendar" />
        </Route>
        <Route exact path="/event/:publicId">
          <Fake title="event" />
        </Route>
        <Route path="*">
          <h1>404 NOT FOUND</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <Fragment>
      <AppHeader />
      <Router />
    </Fragment>
  );
}
