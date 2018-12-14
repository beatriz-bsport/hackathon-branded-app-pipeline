// @flow

import { combineResourceReducers } from './core';

import { reports } from './reporting';

export const reducer = combineResourceReducers({
  reports: reports.reducer,
});
