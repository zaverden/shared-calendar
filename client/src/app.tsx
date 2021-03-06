import React, { useMemo } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider, QueryClient } from "react-query";
import { AppFooter, AppHeader, NotFoundPage } from "@shacal/ui/components";
import { CalendarsListPage } from "./pages/calendars/calendars-list-page";
import { CalendarPage } from "pages/calendars/calendar-page";
import { NewEventPage } from "pages/events/new-event-page";
import { EventPage } from "pages/events/event-page";
import createCache from "@emotion/cache";
import { Global, CacheProvider, css } from "@emotion/react";
import styled from "@emotion/styled";
import { ConfirmEmailPage } from "pages/events/confirm-email-page";
import { getGlobalStyles } from "global-styles";

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

const AppPanel = styled.div`
  max-width: 350px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
`;

const emotionCache = createCache({ key: "emotion-cache" });
emotionCache.compat = true;

export function App() {
  const styles = useMemo(getGlobalStyles, []);
  return (
    <CacheProvider value={emotionCache}>
      <QueryClientProvider client={new QueryClient()}>
        <AppPanel>
          <BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
            <Global styles={styles} />
            <AppHeader />
            <Routes />
            <AppFooter />
          </BrowserRouter>
        </AppPanel>
      </QueryClientProvider>
    </CacheProvider>
  );
}
