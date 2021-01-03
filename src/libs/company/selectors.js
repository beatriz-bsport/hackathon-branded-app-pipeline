// @flow
import { createSelector } from 'reselect';

import type { State } from '../../state/types';

const _getCompanyData = (state: State) => state.company.byId;

const _getSearchedCompanyIdList = (state: State) => state.company.search.allIds;

export const getSearchedCompanyList = createSelector(
  [_getCompanyData, _getSearchedCompanyIdList],
  (data, ids) => ids.map((id) => data[id]),
);
