import objectAssign from 'object-assign';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import type { AutoTagRule, email_template_state } from './types';
import { RootState } from '../../reducers';

// SMARTLIST
export const getSmartListDict = (state: RootState): email_template_state =>
  state.smartList.byId;

export const getSmartListId = (state: RootState): email_template_state =>
  state.smartList.allIds;

export const getAllSmartList = createSelector(
  [getSmartListDict, getSmartListId],
  (smartListDict, IdList) => Immutable(IdList.map((id) => smartListDict[id])),
);

export const getSmartList = (state: RootState, id: number): any =>
  state.smartList.byId[id];
export const getFreshSmartListIds = createSelector(getAllSmartList, (sl) =>
  sl.map((list) => list.id),
);

// SMARTLIST FILTERS
export const getSmartListFilters = (state: RootState, id: number): any =>
  Immutable(
    Object.values(state.smartList.filtersByCategoryId)
      .map((OneFilterDict) => Object.values(OneFilterDict))
      .flat()
      .filter((filter) => filter.smartlist === id),
  );

// SMARTLIST MEMBERS
export const getSmartListMembers = (state: RootState, id: number): any =>
  state.smartList.membersBySmartListId[id];

// SMARTLIST AUTOTAGRULES
export const getSmartListAutoTagDict = (state: RootState) =>
  state.smartList.smartListTagRules.byId;

export const getSmartListAutoTagIds = (state: RootState) =>
  state.smartList.smartListTagRules.allIds;

export const getSmartListAutoTag = createSelector(
  [getSmartListAutoTagDict, getSmartListAutoTagIds],
  (smartListAutoTagDict, IdList) =>
    Immutable(IdList.map((pk) => smartListAutoTagDict[pk])),
);

export const getAutotagRuleBySmartlist = (
  state: RootState,
): { [key: string]: AutoTagRule[] } => {
  return getSmartListAutoTag(state).reduce((acc, val) => {
    if (!acc[val.smartlist]) {
      acc[val.smartlist] = [];
    }
    acc[val.smartlist].push(val);
    return acc;
  }, {});
};

export const getSmartListAutoTagFiltered = (state: RootState, id: number) =>
  objectAssign
    .values(state.smartList.smartListTagRules.byId)
    .filter((tg) => tg.smartlist === id);

// AUTOMATED CAMPAIGN

const _getAutomatedCampaignAllIds = (state: RootState) =>
  state.smartList.automatedCampaign.allIds;
export const _getAutomatedCampaignById = (state: RootState) =>
  state.smartList.automatedCampaign.byId;
const _getAutomatedCampaignBySmartListId = (state: RootState) =>
  state.smartList.automatedCampaign.bySmartListId;
export const getAutomatedCampaignList = createSelector(
  [_getAutomatedCampaignAllIds, _getAutomatedCampaignById],
  (allIds, byId) => allIds.map((id) => byId[id]),
);

export const getAutomatedCampaign = (state: RootState, id: number) =>
  _getAutomatedCampaignById(state)[id];

export const getSmartListAutomatedCampaign = (
  state: RootState,
  smartlist_id: number,
) => _getAutomatedCampaignBySmartListId(state)[smartlist_id];
