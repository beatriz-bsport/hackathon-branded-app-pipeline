// @flow

import { combineResourceReducers } from './core';

import { reports, reportResult } from './reporting';

export const reducer = combineResourceReducers({
  reports: reports.reducer,
  reportResult: reportResult.reducer,
});
