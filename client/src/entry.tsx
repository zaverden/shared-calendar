import React, { Fragment } from "react";
import ReactDOM from "react-dom";

const Greet = () => (
  <Fragment>
    <h1>Hello, there!</h1>
    <a href="/auth/google">Login with google</a>
  </Fragment>
);
ReactDOM.render(
  <React.StrictMode>
    <Greet />
  </React.StrictMode>,
  document.getElementById("root")
);
