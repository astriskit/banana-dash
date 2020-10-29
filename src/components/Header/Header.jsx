import React, { useContext } from "react";
import { Loader } from "../Loader";
import { AppModel } from "../../model";
import "./Header.css";

export const Header = () => {
  const [state] = useContext(AppModel);
  const loading =
    state.bookings.loading ||
    state.guests.loading ||
    state.invoices.loading ||
    state.invoiceables.loading ||
    state.payments.loading;

  return (
    <header className="main">
      {!loading && <div>Banana Inn: Dashboard</div>}
      {loading && (
        <div>
          <Loader />
        </div>
      )}
    </header>
  );
};
