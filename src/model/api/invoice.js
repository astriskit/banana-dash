import { baseGet } from "./base";

const base = baseGet("invoices");

export const listInvoices = () => base();

export const showInvoice = (id) => base(id);
