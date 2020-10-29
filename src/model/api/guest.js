import { baseGet } from "./base";

const base = baseGet("guests");

export const listGuests = () => base();

export const showGuest = (id) => base(id);
