"use client";
import store from "./store";
import { Provider } from "react-redux";
import Session from "./Account/Session";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div className="d-flex" id="wd-kambaz">
          <div className="d-none d-md-block">
            <KambazNavigation />
          </div>
          <div className="flex-fill wd-main-content-offset ms-3">
            {children}
          </div>
        </div>
      </Session>
    </Provider>
  );
}
