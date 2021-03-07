import { Page } from "@shacal/ui/components";
import { usePublicIdParam } from "@shacal/ui/hooks";
import React from "react";

export function ApproveEmailPage() {
  const publicId = usePublicIdParam();

  return (
    <Page title="Approve email" loading={false}>
      {() => <p>ApproveEmailPage {publicId}</p>}
    </Page>
  );
}
