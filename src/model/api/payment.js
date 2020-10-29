import { baseGet } from "./base";

const base = baseGet("payments");

export const listPayments = () => base();

export const showPayment = (id) => base(id);
