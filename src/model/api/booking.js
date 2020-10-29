import { baseGet } from "./base";

const base = baseGet("bookings");

export const listBookings = () => base();

export const showBooking = (id) => base(id);
