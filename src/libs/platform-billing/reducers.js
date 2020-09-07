// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { listPlatformInvoiceActions } from './actions';

const initialState = Immutable({
  platformInvoice: {
    byId: {},
    list: {
      page: null,
      allIds: [],
      nextPage: 1,
    },
  },
});

export default handleActions(
  {
    [listPlatformInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['platformInvoice', 'loading', payload]);
    },
    [listPlatformInvoiceActions.error]: (state, { payload }) => {
      return state.set(['platformInvoice', 'error', payload]);
    },
    [listPlatformInvoiceActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            platformInvoice: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['platformInvoice', 'list', 'allIds'],
          [
            ...state.platformInvoice.list.allIds,
            ...payload.results
              .filter(
                (inv) => !state.platformInvoice.list.allIds.includes(inv.id),
              )
              .map((inv) => inv.id),
          ],
        )
        .setIn(['platformInvoice', 'list', 'page'], payload.page)
        .setIn(['platformInvoice', 'list', 'nextPage'], payload.next_page);
    },
  },
  initialState,
);
