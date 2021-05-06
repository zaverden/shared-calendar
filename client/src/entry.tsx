import "react-datepicker/dist/react-datepicker.css";
import enGb from "date-fns/locale/en-GB";
import React from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ReactDOM from "react-dom";
import { App } from "./app";

registerLocale("en-GB", enGb);
setDefaultLocale("en-GB");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
