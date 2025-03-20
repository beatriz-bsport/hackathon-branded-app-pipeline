import { createStore } from "zustand/vanilla";
import { bindStore } from "@bsport/store-base";
import type { Invoice } from "#src/types";

export interface InvoiceState {
  ids: string[];
  byId: { [key: string]: Invoice };
  count: number;
  page: number;
  receiptUrl: string;
}

export const invoiceStore = createStore<InvoiceState>()(() => ({
  ids: [],
  page: 1,
  count: 0,
  byId: {},
  receiptUrl: "",
}));

/**
 * @description
 * You can :
 * - Retrieve the store :
 *   ```tsx
 *   const invoiceStore = useInvoiceStore();
 *   ```
 * - Retrieve a specific item from the store by providing a selector (1st arg) :
 *   ```tsx
 *   const invoices = useInvoiceStore(selectInvoices);
 *   ```
 *   By default it uses shallow comparison to memoize the returned value.
 * - Provide a specific comparison function for memoization :
 *   ```tsx
 *   const invoices = useInvoiceStore(selectInvoices, (a, b) => a.uuid === b.uuid);
 *   ```
 */
export const useInvoiceStore = bindStore(invoiceStore);
