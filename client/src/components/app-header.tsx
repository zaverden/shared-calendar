import styled from "@emotion/styled";
import { useAuthStatus, useEncodedReturnUrl } from "@shacal/ui/hooks";
import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppLoader } from "./app-loader";

const Logo = styled.img`
  display: block;
  margin: 0 auto;
  max-width: 60%;
  height: auto;
`;

const Slogan = styled.p`
  display: block;
  margin: 0 auto;
  width: fit-content;
  font-size: var(--fs-s);
  line-height: 2em;

  & > span {
    color: var(--fg-a);
    font-weight: var(--fw-b);
  }
`;

const AuthPanel = styled.div`
  float: right;
  margin-left: -100%;
  width: 1em;
  height: 1em;

  & > a > img {
    width: 100%;
    height: 100%;
  }
`;

function LoginLink() {
  const returnUrl = useEncodedReturnUrl();
  return (
    <a href={`/auth/google/_?r=${returnUrl}`} title="Login with google">
      <img src="/google-icon.svg" alt="" />
    </a>
  );
}
function LogoutLink() {
  const returnUrl = useEncodedReturnUrl();
  return (
    <a href={`/auth/logout/_?r=${returnUrl}`} title="Logout">
      <img src="/logout.svg" alt="" />
    </a>
  );
}

function Auth() {
  const authorized = useAuthStatus();
  const { pathname } = useLocation();
  if (pathname === "/" && authorized.data !== true) {
    return null;
  }

  function render() {
    if (authorized.isLoading) {
      return <AppLoader />;
    }
    if (authorized.data) {
      return <LogoutLink />;
    }
    return <LoginLink />;
  }

  return <AuthPanel>{render()}</AuthPanel>;
}

export function AppHeader() {
  return (
    <Fragment>
      <Auth />
      <Link to="/">
        <Logo
          src="/shacal_logo.svg"
          width="358"
          height="104"
          alt="Shacal logo"
        />
      </Link>
      <Slogan>
        Your <span>SHA</span>red <span>CAL</span>endar
      </Slogan>
    </Fragment>
  );
}
