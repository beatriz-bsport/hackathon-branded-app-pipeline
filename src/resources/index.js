// @flow

import { combineResourceReducers } from './core';

import { reports, reportResult, reportMetadata } from './reporting';

export const reducer = combineResourceReducers({
  reports: reports.reducer,
  reportResult: reportResult.reducer,
  reportMetadata: reportMetadata.reducer,
});

export const resources = {
  reports,
  reportResult,
  reportMetadata,
};
