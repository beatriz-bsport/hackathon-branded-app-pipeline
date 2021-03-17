import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { reportGenerationDetail } from './actions';

const initialState: reportGenerationState = Immutable({
  reportResponse: {
    result: [],
    previous_page: null,
    next_page: 1,
    other_pages: [],
  },
  allIds: null,
  loading: false,
  error: null,
  page_size: 100,
});
export default handleActions(
  {
    [reportGenerationDetail.success]: (state, { payload }) => {
      return state.set('reportResponse', payload);
    },
    [reportGenerationDetail.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [reportGenerationDetail.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
  },
  initialState,
);
