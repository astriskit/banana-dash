import React from "react";
import { Header } from "./Header";

export const Layout: React.FC = ({ children }) => (
  <div className="app" data-testid="app">
    <Header />
    {children}
  </div>
);
