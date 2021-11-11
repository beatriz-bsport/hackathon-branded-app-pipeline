import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  reportGenerationDetail,
  reportHeadersDetail,
  exportingExcelReportActions,
  fetchReportMetadataActions,
  fetchReportsActions,
  deleteReportActions,
  updateReportActions,
} from './actions';
import { ReportingState } from './types';

const initialState: Immutable.Immutable<ReportingState> =
  Immutable<ReportingState>({
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
    excelReportingReducer: {
      loading: false,
      link: null,
      error: null,
    },
    list: {
      loading: false,
      error: null,
      results: [],
    },
    metadata: {
      loading: false,
      error: null,
      results: [],
    },
  });

export default handleActions<Immutable.Immutable<ReportingState>>(
  {
    [reportGenerationDetail.success.toString()]: (state, { payload }) => {
      return state.set('reportResponse', payload);
    },
    [reportGenerationDetail.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [reportGenerationDetail.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [reportHeadersDetail.success.toString()]: (state, { payload }) => {
      return state.set('reportHeaders', payload);
    },
    [reportHeadersDetail.isLoading.toString()]: (state, { payload }) => {
      return state.set('heardersLoading', payload);
    },
    [reportHeadersDetail.error.toString()]: (state, { payload }) => {
      return state.set('headersError.toString()', payload);
    },
    [exportingExcelReportActions.success.toString()]: (state, { payload }) => {
      return state.set('excelReportingReducer.link', payload);
    },
    [exportingExcelReportActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('excelReportingReducer.loading', payload);
    },
    [exportingExcelReportActions.error.toString()]: (state, { payload }) => {
      return state.set('excelReportingReducer.error', payload);
    },

    [fetchReportsActions.isLoading.toString()]: (state, payload) => {
      return state
        .setIn(['list', 'loading'], payload)
        .setIn(['list', 'error'], null);
    },
    [fetchReportsActions.error.toString()]: (state, payload) => {
      return state
        .setIn(['list', 'error'], payload.error)
        .setIn(['list', 'loading'], false);
    },
    [fetchReportsActions.success.toString()]: (
      state: Immutable.Immutable<ReportingState>,
      { payload }: any,
    ) => {
      return state
        .setIn(['list', 'loading'], false)
        .setIn(['list', 'error'], null)
        .setIn(['list', 'results'], payload.results);
    },

    [fetchReportMetadataActions.isLoading.toString()]: (state, payload) => {
      return state
        .setIn(['metadata', 'loading'], payload.error)
        .setIn(['metadata', 'error'], null);
    },
    [fetchReportMetadataActions.error.toString()]: (state, payload) => {
      return state
        .setIn(['metadata', 'error'], payload)
        .setIn(['metadata', 'loading'], false);
    },
    [fetchReportMetadataActions.success.toString()]: (
      state: Immutable.Immutable<ReportingState>,
      { payload }: any,
    ) => {
      return state
        .setIn(['metadata', 'loading'], false)
        .setIn(['metadata', 'error'], null)
        .setIn(['metadata', 'results'], payload.results);
    },
    [deleteReportActions.success.toString()]: (state) => {
      return state.set('loading', false).set('error', null);
    },
    [deleteReportActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [deleteReportActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', null);
    },
    [updateReportActions.success.toString()]: (state) => {
      return state.set('loading', false).set('error', null);
    },
    [updateReportActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [updateReportActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', null);
    },
  },
  initialState,
);
