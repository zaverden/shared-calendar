import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import React from "react";

export function DescriptionView({ description }: { description: string }) {
  const sanitized = DOMPurify.sanitize(description);
  return (
    <div
      className="ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
