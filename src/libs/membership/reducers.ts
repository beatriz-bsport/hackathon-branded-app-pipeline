import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  listAsConsumerActions,
  retrieveActions,
  setActiveActions,
  linkActions,
  requestMemberShipValidationActions,
} from './actions';

import { Membership, MembershipState } from './types';
import { USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY } from '../member/utils';

const initialState: Immutable.Immutable<MembershipState> = Immutable<MembershipState>(
  {
    byId: {},
    activeMembership: null,
    retrieve: {
      loading: false,
      error: null,
    },
    asConsumer: {
      loading: false,
      error: null,
      allIds: [],
      count: 0,
      next_page: 1,
      page: 0,
    },
    link: {
      loading: false,
      error: null,
    },
    memberShipValidation: {
      loading: false,
      error: null,
      missingInformation: {
        validated: true,
        fields: [],
        status: USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
      },
    },
  },
);

export default handleActions<Immutable.Immutable<MembershipState>>(
  {
    [setActiveActions.toString()]: (state, { payload }: any) => {
      return state.set('activeMembership', payload);
    },
    [listAsConsumerActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'loading'], payload);
    },
    [listAsConsumerActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['asConsumer', 'error'], payload);
    },
    [listAsConsumerActions.success.toString()]: (state, { payload }: any) => {
      const newIds = payload.results.map((m: Membership) => m.company);
      return state
        .set(
          'byId',
          payload.results.reduce(
            (acc: any, v: any) => ({ ...acc, [v.company]: v }),
            {},
          ),
        )
        .setIn(
          ['asConsumer', 'allIds'],
          payload.page === 1
            ? newIds
            : [...state.asConsumer.allIds.asMutable(), ...newIds],
        )
        .setIn(['asConsumer', 'next_page'], payload.next_page);
    },
    [retrieveActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'loading'], payload);
    },
    [retrieveActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['retrieve', 'error'], payload);
    },
    [retrieveActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['byId', payload.company], payload);
    },
    [linkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['link', 'loading'], payload);
    },
    [linkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['link', 'error'], payload);
    },
    [linkActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['byId', payload.company], payload);
    },
    [requestMemberShipValidationActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberShipValidation', 'loading'], payload);
    },
    [requestMemberShipValidationActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberShipValidation', 'error'], payload);
    },
    [requestMemberShipValidationActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(
        ['memberShipValidation', 'missingInformation'],
        payload,
      );
    },
  },
  initialState,
);
