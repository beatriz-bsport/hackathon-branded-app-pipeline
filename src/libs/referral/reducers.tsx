import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import {
  retrieveReferralProgramActions,
  updateReferralProgramActions,
  retrieveReferralMemberStatusActions,
} from './actions';

import { ReferralProgram, ReferralState, ReferralMemberStatus } from './types';

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
    ) => state.setIn(['referralProgram', 'byId'], { [payload.id]: payload }),

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
      state.setIn(['referralMemberStatus', 'byId'], {
        [payload.member_id]: payload,
      }),
  },
  initialState,
);
