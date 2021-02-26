import React, { Fragment, ReactElement, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { AppLoader } from "./app-loader";
import { AuthPage } from "./auth-page";
import { NotFoundPage } from "./not-found-page";

export type PageProps = {
  title: string;
  loading: boolean;
  showAuth?: boolean;
  show404?: boolean;
  children: () => ReactElement;
};

export function Page({
  title,
  loading,
  showAuth = false,
  show404 = false,
  children,
}: PageProps) {
  const renderMain = () => {
    if (loading) {
      return <AppLoader />;
    }
    if (showAuth) {
      return <AuthPage />;
    }
    if (show404) {
      return <NotFoundPage />;
    }
    return children();
  };

  return (
    <Fragment>
      <Helmet>
        <title>ShaCal - {title}</title>
      </Helmet>
      {renderMain()}
    </Fragment>
  );
}
