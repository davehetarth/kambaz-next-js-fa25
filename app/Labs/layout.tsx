import { ReactNode } from "react";
import TOC from "./TOC";

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="d-flex align-items-start gap-3">
      <div style={{ width: "100px", flexShrink: "0" }}>
        <TOC />
      </div>
      <div className="flex-grow-1">{children}</div>
    </div>
  );
}
