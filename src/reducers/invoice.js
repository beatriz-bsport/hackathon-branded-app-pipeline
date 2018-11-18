import Immutable from 'seamless-immutable';

import actionTypes from '../actions/invoice.types';
import authActionTypes from '../actions/auth.types';

const initialState = Immutable({
  all: [],
  loading: true,
  loadingSpecific: false,
  errorSpecific: false,
  invoice: null,
  createOrUpdatePending: false,
});

export default function invoiceReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case actionTypes.HAS_FETCHED_INVOICES:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        all: action.invoices,
      });

    case actionTypes.START_FETCH_INVOICES:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_INVOICES:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.error,
      });

    case actionTypes.INVOICE_SPECIFIC_SUCCESS_FETCH:
      return Immutable.merge(state, {
        loadingSpecific: false,
        errorSpecific: false,
        createOrUpdatePending: false,
        invoice: action.invoice,
      });

    case actionTypes.INVOICE_SPECIFIC_START_FETCH:
      return Immutable.merge(state, {
        loadingSpecific: true,
        errorSpecific: false,
        invoice: null,
      });

    case actionTypes.INVOICE_SPECIFIC_ERROR_FETCHING:
      return Immutable.merge(state, {
        loadingSpecific: false,
        errorSpecific: true,
        errorMsg: action.error,
        invoice: null,
      });

    case actionTypes.PAYMENT_ITEM_START_UPDATE_STATUS:
      return Immutable.merge(state, {
        refreshingSpecific: true,
      });

    case actionTypes.PAYMENT_ITEM_ERROR_PAYMENT_STATUS:
      return Immutable.merge(state, {
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
        return Immutable.merge(state, {
          refreshingSpecific: false,
          invoice: { ...state.invoice, payments: refreshedPayments },
        });
      }
      return Immutable.merge(state, {
        refreshingSpecific: false,
      });

    case actionTypes.INVOICE_CREATE_OR_UPDATE_RESET:
      return Immutable.merge(state, {
        createOrUpdatePending: false,
      });
    case actionTypes.INVOICE_CREATE_OR_UPDATE:
      return Immutable.merge(state, {
        createOrUpdatePending: true,
      });

    case actionTypes.INVOICE_CREATE_SUCCESS:
      return Immutable.merge(state, {
        createOrUpdatePending: false,
        all: [...state.all, action.invoice],
      });

    case actionTypes.INVOICE_CREATE_OR_UPDATE_ERROR:
      return Immutable.merge(state, {
        createOrUpdateError: action.error,
        createOrUpdatePending: false,
      });

    case actionTypes.INVOICE_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        all: [
          action.invoice,
          ...state.all.filter((inv) => inv.uuid !== action.invoice.uuid),
        ],
      });

    default:
      return state;
  }
}
