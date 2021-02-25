import React from "react";

function getRootUrl(): string {
  const { pathname, search } = window.location;
  return pathname + search;
}
function getEncodedRootUrl(): string {
  return encodeURIComponent(getRootUrl());
}

export function AuthPage() {
  const authUrl = `/auth/google?r=${getEncodedRootUrl()}`;
  return (
    <div>
      <p>
        Welcome to <b>SHA</b>red <b>CAL</b>endar
      </p>
      <a href={authUrl}>[GOOGLE] Start</a>
    </div>
  );
}
