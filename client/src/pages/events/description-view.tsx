import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import React from "react";

export function DescriptionView({ description }: { description: string }) {
  const sanitized = DOMPurify.sanitize(description);
  return (
    <div
      className="ql-editor"
      style={{ fontWeight: "500", fontSize: "18px", color: "#202020" }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
