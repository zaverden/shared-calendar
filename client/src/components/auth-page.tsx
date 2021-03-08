import React from "react";
import { useEncodedReturnUrl } from "@shacal/ui/hooks";

export function AuthPage() {
  const returnUrl = useEncodedReturnUrl();
  const authUrl = `/auth/google/_?r=${returnUrl}`;
  return (
    <div>
      <p>
        Welcome to <b>SHA</b>red <b>CAL</b>endar
      </p>
      <a href={authUrl}>[GOOGLE] Start</a>
    </div>
  );
}
