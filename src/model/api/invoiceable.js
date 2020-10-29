import { baseGet } from "./base";

const base = baseGet("invoiceables");

export const listInvoiceables = () => base();

export const showInvoiceable = (id) => base(id);
