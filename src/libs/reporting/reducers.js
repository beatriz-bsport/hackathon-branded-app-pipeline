import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { reportGenerationDetail, reportHeadersDetail } from './actions';

const initialState: reportGenerationState = Immutable({
  reportResponse: {
    reportId: {
      result: [],
      previous_page: null,
      next_page: 1,
      other_pages: [],
    },
  },
  allIds: null,
  loading: false,
  error: null,
  page_size: 50,
  reportId: null,
  reportHeaders: {},
  headersLoading: false,
  headersError: null,
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
    [reportHeadersDetail.success]: (state, { payload }) => {
      return state.set('reportHeaders', payload);
    },
    [reportHeadersDetail.isLoading]: (state, { payload }) => {
      return state.set('heardersLoading', payload);
    },
    [reportHeadersDetail.error]: (state, { payload }) => {
      return state.set('headersError', payload);
    },
  },
  initialState,
);
