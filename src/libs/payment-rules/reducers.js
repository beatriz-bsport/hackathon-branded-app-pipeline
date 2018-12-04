// @flow

import lodash from 'lodash';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  paymentRuleSet,
  paymentRuleSetUpsert,
  paymentRuleSetDelete,
  showDialog,
} from './actions';

import type { PaymentRulesState, PaymentRulesAction } from './types';

const initialState: PaymentRulesState = Immutable({
  items: {},
  lastFetched: null,
  loading: false,
  error: null,

  // Upsert
  upsert: {
    loading: false,
    error: null,
  },

  // Dialog
  dialog: false,
});

export default handleActions(
  {
    [paymentRuleSet.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [paymentRuleSet.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [paymentRuleSet.success]: (state, { payload }) => {
      return state.merge({
        items: lodash.keyBy(payload, 'id'),
        lastFetched: new Date(),
      });
    },
    [paymentRuleSetUpsert.success]: (state, { payload }) => {
      return state.setIn(['items', payload.id], payload);
    },
    [paymentRuleSetUpsert.isLoading]: (state, { payload }) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [paymentRuleSetUpsert.error]: (state, { payload }) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [paymentRuleSetDelete.isLoading]: (state, { payload }) => {
      return state.setIn(['items', payload.id, 'deleting'], true);
    },
    [paymentRuleSetDelete.error]: (state, { payload }) => {
      return state.setIn(['items', payload.id, 'deleting'], undefined);
    },
    [paymentRuleSetDelete.success]: (state, { payload }) => {
      return state.set('items', lodash.omit(state.items, payload.id));
    },
    [showDialog]: (state, { payload }) => {
      return state.set('dialog', payload);
    },
  },
  initialState,
);
