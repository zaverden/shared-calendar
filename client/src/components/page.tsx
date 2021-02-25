import React, { ReactElement, ReactNode } from "react";
import { AppLoader } from "./app-loader";
import { AuthPage } from "./auth-page";

export type PageProps = {
  loading: boolean;
  showAuth?: boolean;
  children: () => ReactElement;
};

export function Page({ loading, showAuth = false, children }: PageProps) {
  if (loading) {
    return <AppLoader />;
  }
  if (showAuth) {
    return <AuthPage />;
  }
  return children();
}
