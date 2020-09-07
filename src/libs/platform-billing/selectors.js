import { createSelector } from 'reselect';

const getPlatformInvoiceIdList = (state) =>
  state.platformBilling.platformInvoice.list.allIds;
const getPlatformInvoiceData = (state) =>
  state.platformBilling.platformInvoice.byId;

export const getPlatformInvoiceList = createSelector(
  [getPlatformInvoiceIdList, getPlatformInvoiceData],
  (ids, data) => ids.map((id) => data[id]),
);
