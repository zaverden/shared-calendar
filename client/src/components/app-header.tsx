import styled from "@emotion/styled";
import { useAuthStatus, useEncodedReturnUrl } from "@shacal/ui/hooks";
import { Anchor } from "@shacal/ui/kit";
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
  height: 1em;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 5px;

  & > span {
    align-self: flex-end;
    font-size: var(--fs-s);
  }

  & > a {
    font-size: var(--fs-s);
    text-decoration: none;

    & > img {
      width: 1em;
      height: 1em;
      margin-bottom: -0.1em;
    }
  }
`;

const AuthLoader = styled(AppLoader)`
  height: 1em;
  width: 1em;
  padding-bottom: unset;
`;

function LoginLink() {
  const returnUrl = useEncodedReturnUrl();
  return (
    <Anchor href={`/auth/google/_?r=${returnUrl}`} title="Login with google">
      Login with <img src="/google-icon.svg" alt="" />
    </Anchor>
  );
}
function LogoutLink({ email }: { email: string }) {
  const returnUrl = useEncodedReturnUrl();
  return (
    <Fragment>
      <span>{email}</span>
      <a href={`/auth/logout/_?r=${returnUrl}`} title="Logout">
        <img src="/logout.svg" alt="" />
      </a>
    </Fragment>
  );
}

function Auth() {
  const authorized = useAuthStatus();
  const { pathname } = useLocation();
  if (pathname === "/" && authorized.data?.authenticated !== true) {
    return null;
  }

  function render() {
    if (authorized.isLoading) {
      return <AuthLoader />;
    }
    if (authorized.data?.authenticated === true) {
      return <LogoutLink email={authorized.data.userEmail} />;
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
