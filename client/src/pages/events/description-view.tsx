import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import React from "react";

export function DescriptionView({ description }: { description: string }) {
  const sanitized = DOMPurify.sanitize(description);
  return (
    <div
      className="ql-editor"
      style={{ fontWeight: "var(--fw-default)", fontSize: "var(--fs-xl)", color: "var(--fg-p)" }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
