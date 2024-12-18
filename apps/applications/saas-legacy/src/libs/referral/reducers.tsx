import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  retrieveReferralProgramActions,
  updateReferralProgramActions,
  retrieveReferralMemberStatusActions,
  retrieveReferralLinkStatusActions,
  referralExceptionActions,
} from './actions';

import {
  ReferralProgram,
  ReferralState,
  ReferralMemberStatus,
  ReferralLinkStatus,
} from './types';

const initialState: Immutable.Immutable<ReferralState> =
  Immutable<ReferralState>({
    referralProgram: {
      byId: {},
      loading: false,
      error: null,
    },
    updateReferralProgram: {
      loading: false,
      error: null,
    },
    referralMemberStatus: {
      byId: {},
      loading: false,
      error: null,
    },
    referralLinkStatus: {
      byId: {},
      loading: false,
      error: null,
    },
    referralException: {
      registrationErrorCode: null,
    },
  });

export default handleActions<Immutable.Immutable<ReferralState>, any>(
  {
    [retrieveReferralProgramActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['referralProgram', 'loading'], payload),
    [retrieveReferralProgramActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['referralProgram', 'error'], payload),
    [retrieveReferralProgramActions.success.toString()]: (
      state,
      { payload }: { payload: ReferralProgram },
    ) => state.setIn(['referralProgram', 'byId', payload.id], payload),

    [updateReferralProgramActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['updateReferralProgram', 'loading'], payload),
    [updateReferralProgramActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['updateReferralProgram', 'error'], payload),
    [updateReferralProgramActions.success.toString()]: (
      state,
      { payload }: { payload: ReferralProgram },
    ) => state.setIn(['referralProgram', 'byId', payload.id], payload),

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
    ) =>
      state.setIn(['referralMemberStatus', 'byId', payload.member_id], payload),

    [retrieveReferralLinkStatusActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['referralLinkStatus', 'loading'], payload),
    [retrieveReferralLinkStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['referralLinkStatus', 'error'], payload),
    [retrieveReferralLinkStatusActions.success.toString()]: (
      state,
      { payload }: { payload: ReferralLinkStatus },
    ) =>
      state.setIn(['referralLinkStatus', 'byId'], {
        [payload.referring_member_id]: payload,
      }),
    [referralExceptionActions.setRegistrationError.toString()]: (
      state,
      { payload }: { payload: { errorCode: number } },
    ) => {
      return state.setIn(
        ['referralException', 'registrationErrorCode'],
        payload,
      );
    },
  },
  initialState,
);
