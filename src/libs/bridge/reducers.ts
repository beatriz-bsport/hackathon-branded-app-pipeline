import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import type {
  ReferralMemberStatus,
  ReferralProgram,
} from 'bsport-saas/src/libs/referral/types';
import type { Member } from 'bsport-saas/src/api/types';
import type { Membership } from 'bsport-saas/src/libs/membership/types';
import {
  basketCountActions,
  bookingCountActions,
  authenticationStatusActions,
  memberTagActions,
  getVideoPlaybackUrlActions,
  listRegisteredIds,
  retrieveReferralProgramForCompanyActions,
  retrieveMemberAction,
  retrieveMembershipByCompanyAction,
  retrieveReferralMemberStatusActions,
} from './actions';

export type BridgeState = {
  authentication: {
    authenticated: boolean,
    username: string,
    error: Error | null,
    hasBeenReceived: boolean,
  },
  basket: {
    count: number | null,
    loading: boolean,
    error: Error | null,
  },
  booking: {
    count: number | null,
    loading: boolean,
    error: Error | null,
  },
  tag: {
    loading: boolean,
    error: Error | null,
    tag_list: Array<number>,
  },
  video: {
    playbackUrl: {
      byId: { [id: number]: string },
      loading: boolean,
      error: Error | null,
      accessDenied: boolean,
    },
  },
  registeredOffers: {
    loading: boolean,
    error: Error | null,
    ids_list: Array<number>,
  },
  referralProgram: {
    byId: { [id: number]: ReferralProgram },
    byCompanyId: { [id: number]: ReferralProgram },
    loading: boolean,
    error: Error | null,
  },
  referralMemberStatus: {
    byMemberId: { [id: number]: ReferralMemberStatus },
    loading: boolean,
    error: Error | null,
  },
  member: {
    byId: Record<number, Member>,
    loading: boolean,
    error: Error | null,
  },
  membership: {
    byCompanyId: Record<number, Membership>,
    loading: boolean,
    error: Error | null,
  },
};

export const initialState: Immutable.Immutable<BridgeState> = Immutable<BridgeState>(
  {
    authentication: {
      authenticated: false,
      username: '',
      error: null,
      hasBeenReceived: false,
    },
    basket: {
      count: null,
      loading: false,
      error: null,
    },
    booking: {
      count: null,
      loading: false,
      error: null,
    },
    tag: {
      loading: false,
      error: null,
      tag_list: [],
    },
    video: {
      playbackUrl: {
        byId: {},
        loading: false,
        error: null,
        accessDenied: false,
      },
    },
    registeredOffers: {
      loading: false,
      error: null,
      ids_list: [],
    },
    referralProgram: {
      byId: {},
      byCompanyId: {},
      loading: false,
      error: null,
    },
    referralMemberStatus: {
      byMemberId: {},
      loading: false,
      error: null,
    },
    member: {
      byId: {},
      loading: false,
      error: null,
    },
    membership: {
      byCompanyId: {},
      error: null,
      loading: false,
    },
  },
);

export default handleActions<Immutable.Immutable<BridgeState>>(
  {
    /** SAAS DATA */
    [authenticationStatusActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state
        .setIn(['authentication', 'authenticated'], payload.authenticated)
        .setIn(['authentication', 'username'], payload.username);
    },
    [authenticationStatusActions.hasBeenReceived.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['authentication', 'hasBeenReceived'], payload);
    },
    [authenticationStatusActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['authentication', 'error'], payload);
    },
    [basketCountActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'count'], payload);
    },
    [basketCountActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [basketCountActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [bookingCountActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'count'], payload);
    },
    [bookingCountActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'loading'], payload);
    },
    [bookingCountActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['booking', 'error'], payload);
    },
    [memberTagActions.isLoading.toString()]: (state, { payload }: any) => {
      return state.setIn(['tag', 'loading'], payload);
    },
    [memberTagActions.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['error', 'error'], payload);
    },
    [memberTagActions.success.toString()]: (state, { payload }: any) => {
      return state.setIn(
        ['tag', 'tag_list'],
        [...payload.data.map((tag: any) => tag.id)],
      );
    },
    [listRegisteredIds.error.toString()]: (state, { payload }: any) => {
      return state.setIn(['registeredOffers', 'error'], payload);
    },
    [listRegisteredIds.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['registeredOffers', 'loading'], payload);
    },
    [listRegisteredIds.success.toString()]: (state, { payload }) => {
      return state.setIn(['registeredOffers', 'ids_list'], payload);
    },
    [getVideoPlaybackUrlActions.error.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'error'], payload);
    },
    [getVideoPlaybackUrlActions.accessDenied.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'accessDenied'], payload);
    },
    [getVideoPlaybackUrlActions.isLoading.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(['video', 'playbackUrl', 'loading'], payload);
    },
    [getVideoPlaybackUrlActions.success.toString()]: (
      state,
      { payload }: any,
    ) => {
      return state.setIn(
        ['video', 'playbackUrl', 'byId', payload.videoId],
        payload.playbackUrl,
      );
    },
    [retrieveReferralProgramForCompanyActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['referralProgram', 'loading'], payload),
    [retrieveReferralProgramForCompanyActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['referralProgram', 'error'], payload),
    [retrieveReferralProgramForCompanyActions.success.toString()]: (
      state,
      { payload }: { payload: ReferralProgram },
    ) => {
      return state
        .setIn(['referralProgram', 'byId', payload.id], payload)
        .setIn(['referralProgram', 'byCompanyId', payload.company], payload);
    },
    [retrieveMemberAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['member', 'loading'], payload),
    [retrieveMemberAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['member', 'error'], payload),
    [retrieveMemberAction.success.toString()]: (
      state,
      { payload }: { payload: Member },
    ) => {
      return state.setIn(['member', 'byId', payload.id], payload);
    },
    [retrieveMembershipByCompanyAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['membership', 'loading'], payload),
    [retrieveMembershipByCompanyAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['membership', 'error'], payload),
    [retrieveMembershipByCompanyAction.success.toString()]: (
      state,
      { payload }: { payload: Membership },
    ) => {
      return state.setIn(
        ['membership', 'byCompanyId', payload.company],
        payload,
      );
    },
    [retrieveReferralMemberStatusActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['referralMemberStatus', 'loading'], payload),
    [retrieveReferralMemberStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['referralMemberStatus', 'error'], payload),
    [retrieveReferralMemberStatusActions.success.toString()]: (
      state,
      { payload }: { payload: ReferralMemberStatus },
    ) => {
      return state.setIn(
        ['referralMemberStatus', 'byMemberId', payload.member_id],
        payload,
      );
    },
  },
  initialState,
);
