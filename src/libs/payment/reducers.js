// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  listSavedPaymentMethodListActions,
  onSpotPaymentReportActions,
  listPaymentGroupActions,
} from './actions';

const initialState = Immutable({
  paymentMethod: {
    loading: false,
    error: null,
    items: [],
  },
  onSpotPaymentReport: {
    id: null,
    error: null,
    loading: false,
  },
  paymentGroup: {
    error: null,
    loading: false,
    allIds: [],
    byId: {},
  },
});

export default handleActions(
  {
    [listSavedPaymentMethodListActions.success]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'items'], payload);
    },
    [listSavedPaymentMethodListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'loading'], payload);
    },
    [listSavedPaymentMethodListActions.error]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'error'], payload);
    },
    [onSpotPaymentReportActions.success]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'id'], payload[0].id);
    },
    [onSpotPaymentReportActions.isLoading]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'loading'], payload);
    },
    [onSpotPaymentReportActions.error]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'error'], payload);
    },
    [listPaymentGroupActions.error]: (state, { payload }) => {
      return state.setIn(['paymentGroup', 'error'], payload);
    },
    [listPaymentGroupActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentGroup', 'loading'], payload);
    },
    [listPaymentGroupActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['paymentGroup', 'allIds'],
          payload.map((pg) => pg.id),
        )
        .merge(
          {
            paymentGroup: {
              byId: payload.reduce((acc, v) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
