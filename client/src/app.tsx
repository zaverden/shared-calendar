import React, { useMemo } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider, QueryClient } from "react-query";
import { AppFooter, AppHeader, NotFoundPage } from "@shacal/ui/components";
import { COLOR_VARS, FONT_SIZE_VARS, FONT_WEIGHT_VARS } from "@shacal/ui/kit";
import { CalendarsListPage } from "./pages/calendars/calendars-list-page";
import { CalendarPage } from "pages/calendars/calendar-page";
import { NewEventPage } from "pages/events/new-event-page";
import { EventPage } from "pages/events/event-page";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { ConfirmEmailPage } from "pages/events/confirm-email-page";

function Routes() {
  return (
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
      <Route exact path="/event/:publicId/confirm-email">
        <ConfirmEmailPage />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}

function getGlobalStyles() {
  return css`
    :root {
      ${COLOR_VARS}
      ${FONT_SIZE_VARS}
      ${FONT_WEIGHT_VARS}
      font-family: "Inter", sans-serif;
      font-size: 10px;
    }
    body {
      font-size: var(--fs-m);
      font-weight: var(--fw-default);
      color: var(--fg-p);
      margin: 0;
    }
    button {
      font-size: inherit;
    }
    a[disabled] {
      pointer-events: none;
    }
  `;
}

const AppPanel = styled.div`
  max-width: 350px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
`;

export function App() {
  const styles = useMemo(getGlobalStyles, []);
  return (
    <AppPanel>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
          <Global styles={styles} />
          <AppHeader />
          <Routes />
          <AppFooter />
        </BrowserRouter>
      </QueryClientProvider>
    </AppPanel>
  );
}
