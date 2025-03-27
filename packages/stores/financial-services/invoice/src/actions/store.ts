import { invoiceStore } from "#src/store";
import type { Invoice } from "#src/types";

export const updateInvoice = (updatedInvoice: Invoice) => {
  invoiceStore.setState((state) => {
    const id = updatedInvoice?.uuid;
    if (!id) return state;
    return {
      ids: state.ids.includes(id) ? state.ids : [...state.ids, id],
      byId: { ...state.byId, [id]: updatedInvoice },
    };
  });
};

export const setInvoices = ({
  invoices,
  count,
  page,
}: {
  invoices: Invoice[];
  count: number;
  page: number;
}) => {
  invoiceStore.setState((state) => {
    const byId = invoices.reduce((acc, invoice) => {
      acc[invoice.uuid] = invoice;
      return acc;
    }, state.byId);
    return {
      ids: invoices.map((invoice) => invoice.uuid),
      byId,
      count,
      page,
    };
  });
};

export const updateReceiptUrl = (updatedReceiptUrl: string) => {
  invoiceStore.setState({ receiptUrl: updatedReceiptUrl });
};
