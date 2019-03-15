import Immutable from 'seamless-immutable';

import actionTypes from '../actions/invoice.types';

const initialState = Immutable({
  all: [],
  loading: true,
  loadingSpecific: false,
  errorSpecific: false,
  invoice: null,
  error: null,
  createOrUpdatePending: false,

  quickInvoices: [],
  quickInvoiceLoading: false,
});

export default function invoiceReducers(state = initialState, action = {}) {
  switch (action.type) {
    case 'INVOICE/FINALIZE/IS_LOADING': {
      const index = state.all.findIndex(
        (inv) => inv.uuid === action.payload.uuid,
      );
      const invoice = state.all[index];
      const updatedInvoice = { ...invoice, loading: action.payload.loading };
      return state.setIn(['all', index], updatedInvoice);
    }
    case 'INVOICE/FINALIZE/SUCCESS': {
      const index = state.all.findIndex(
        (inv) => inv.uuid === action.payload.uuid,
      );
      return state.setIn(['all', index], action.payload);
    }
    case 'INVOICE/FINALIZE/ERROR': {
      return state.set('error', action.payload);
    }
    case actionTypes.INVOICE_QUICK_CREATE_START:
      return state.merge({
        quickInvoicesLoading: true,
      });

    case actionTypes.INVOICE_QUICK_CREATE_SUCCESS:
      return state.merge({
        quickInvoices: [...state.quickInvoices, action.invoice],
        quickInvoicesLoading: false,
      });

    case actionTypes.INVOICE_QUICK_RESET:
      if (action.uuid) {
        return state.merge({
          quickInvoiceLoading: false,
          quickInvoices: state.quickInvoices.filter(
            (qi) => qi.uuid !== action.uuid,
          ),
        });
      }
      return state.merge({
        quickInvoiceLoading: false,
        quickInvoices: [],
      });

    case actionTypes.INVOICE_QUICK_CREATE_ERROR:
      return state.merge({ quickInvoiceLoading: false });

    case actionTypes.HAS_FETCHED_INVOICES:
      return state.merge({
        loading: false,
        error: false,
        all: action.invoices,
      });

    case actionTypes.START_FETCH_INVOICES:
      return state.merge({ loading: true, error: false });

    case actionTypes.ERROR_FETCHING_INVOICES:
      return state.merge({
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.INVOICE_SPECIFIC_SUCCESS_FETCH:
      return state.merge({
        loadingSpecific: false,
        errorSpecific: false,
        createOrUpdatePending: false,
        invoice: action.invoice,
      });

    case actionTypes.INVOICE_SPECIFIC_START_FETCH:
      return state.merge({
        loadingSpecific: true,
        errorSpecific: false,
        invoice: null,
      });

    case actionTypes.INVOICE_SPECIFIC_ERROR_FETCHING:
      return state.merge({
        loadingSpecific: false,
        errorSpecific: true,
        errorMsg: action.error,
        invoice: null,
      });

    case actionTypes.PAYMENT_ITEM_START_UPDATE_STATUS:
      return state.merge({
        refreshingSpecific: true,
      });

    case actionTypes.PAYMENT_ITEM_ERROR_PAYMENT_STATUS:
      return state.merge({
        refreshingSpecific: false,
      });

    case actionTypes.PAYMENT_ITEM_UPDATED_PAYMENT_STATUS:
      if (action.payment.invoice === state.invoice.uuid) {
        const refreshedPayments = [
          ...state.invoice.payments.filter(
            (p) => p.uuid !== action.payment.uuid,
          ),
          action.payment,
        ];
        return state.merge({
          refreshingSpecific: false,
          invoice: { ...state.invoice, payments: refreshedPayments },
        });
      }
      return state.merge({
        refreshingSpecific: false,
      });

    case actionTypes.INVOICE_CREATE_OR_UPDATE_RESET:
      return state.merge({
        createOrUpdatePending: false,
      });
    case actionTypes.INVOICE_CREATE_OR_UPDATE:
      return state.merge({
        createOrUpdatePending: true,
      });

    case actionTypes.INVOICE_CREATE_SUCCESS:
      return state.merge({
        createOrUpdatePending: false,
        all: [...state.all, action.invoice],
      });

    case actionTypes.INVOICE_CREATE_OR_UPDATE_ERROR:
      return state.merge({
        createOrUpdateError: action.error,
        createOrUpdatePending: false,
      });

    case actionTypes.INVOICE_UPDATE_SUCCESS:
      return state.merge({
        all: [
          action.invoice,
          ...state.all.filter((inv) => inv.uuid !== action.invoice.uuid),
        ],
      });

    default:
      return state;
  }
}
