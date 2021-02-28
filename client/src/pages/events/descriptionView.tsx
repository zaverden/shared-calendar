import DOMPurify from "dompurify";
import React from "react";

export function DescriptionView({ description }: { description: string }) {
  const sanitized = DOMPurify.sanitize(description.replaceAll("\n", "<br>"));
  return <p dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
