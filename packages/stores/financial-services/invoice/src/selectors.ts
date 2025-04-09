import type { InvoiceState } from "./store";

export const selectInvoices = (state: InvoiceState) => {
  const { ids, byId } = state;
  return ids.map((id) => byId[id]);
};

export const selectInvoice = (state: InvoiceState, uuid: string) =>
  state.byId[uuid];

export const selectCount = (state: InvoiceState) => state.count;
