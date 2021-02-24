import React from "react";
import ReactDOM from "react-dom";

const Greet = () => <h1>Hello, there!</h1>;
ReactDOM.render(
  <React.StrictMode>
    <Greet />
  </React.StrictMode>,
  document.getElementById("root")
);
