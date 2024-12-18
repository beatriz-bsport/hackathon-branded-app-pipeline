import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listPartnershipActions,
  updatePartnershipActions,
  requestPartnershipActions,
  listPartnershipEstablishmentMergeActions,
} from './actions';

import { PartnershipState, PartnershipCompany } from './types';

const initialState: Immutable.Immutable<PartnershipState> =
  Immutable<PartnershipState>({
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    createOrUpdate: {
      loading: false,
      error: null,
    },
    partnershipEstablishmentMerge: {
      items: [],
      loading: false,
      error: null,
    },
  });

export default handleActions(
  {
    [requestPartnershipActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [requestPartnershipActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updatePartnershipActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['byId', payload.identifier], payload);
    },
    [updatePartnershipActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updatePartnershipActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [listPartnershipEstablishmentMergeActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['partnershipEstablishmentMerge', 'loading'], payload);
    },
    [listPartnershipEstablishmentMergeActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['partnershipEstablishmentMerge', 'error'], payload);
    },
    [listPartnershipEstablishmentMergeActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['partnershipEstablishmentMerge', 'items'], payload);
    },
    [listPartnershipActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listPartnershipActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listPartnershipActions.success.toString()]: (state, { payload }) => {
      return state
        .set(
          'byId',
          // @ts-expect-error
          payload.reduce(
            (
              acc: { [identifier: string]: PartnershipCompany },
              ps: PartnershipCompany,
            ) => {
              acc[ps.identifier] = ps;
              return acc;
            },
            {},
          ),
        )
        .set(
          'allIds',
          // @ts-expect-error
          payload.map((pc: PartnershipCompany) => pc.id),
        );
    },
  },
  initialState,
);
