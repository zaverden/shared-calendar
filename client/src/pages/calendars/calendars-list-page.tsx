import { Page } from "@shacal/ui/components";
import React from "react";

export function CalendarsListPage() {
  const h = () => {
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
    return "cal-li-page";
  };
  return <Page loading={false}>{() => <h2>{h()}</h2>}</Page>;
}
