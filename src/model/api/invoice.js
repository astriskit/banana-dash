import { baseGet } from "./base";

const base = baseGet("invoices");

export const listGuests = () => base();

export const showGuest = (id) => base(id);
