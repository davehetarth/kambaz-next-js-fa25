"use client";
import { ReactNode } from "react";
import TOC from "./TOC";
import store from "./Lab4/store";
import { Provider } from "react-redux";

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="d-flex align-items-start gap-3">
      <div style={{ width: "100px", flexShrink: "0" }}>
        <TOC />
      </div>
      <Provider store={store}>
        <div className="flex-grow-1">{children}</div>
      </Provider>
    </div>
  );
}
