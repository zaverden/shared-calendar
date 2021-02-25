import React, { Fragment, ReactElement, ReactNode } from "react";
import { Helmet } from "react-helmet";
import { AppLoader } from "./app-loader";
import { AuthPage } from "./auth-page";

export type PageProps = {
  title: string;
  loading: boolean;
  showAuth?: boolean;
  children: () => ReactElement;
};

export function Page({
  title,
  loading,
  showAuth = false,
  children,
}: PageProps) {
  const renderMain = () => {
    if (loading) {
      return <AppLoader />;
    }
    if (showAuth) {
      return <AuthPage />;
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
