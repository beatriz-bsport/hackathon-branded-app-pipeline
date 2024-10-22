import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { fetchReportOfferManagementActions } from './actions';
import type { ReportingState } from '#src/libs/reporting/common/types';

const initialState: Immutable.Immutable<ReportingState> =
  Immutable<ReportingState>({
    offerManagement: {
      loading: false,
      error: null,
    },
  });

export default handleActions<Immutable.Immutable<ReportingState>>(
  {
    [fetchReportOfferManagementActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['offerManagement', 'loading'], payload);
    },
    [fetchReportOfferManagementActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['offerManagement', 'error'], payload);
    },
  },
  initialState,
);
