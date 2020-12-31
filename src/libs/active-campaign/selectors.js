// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import { getSmartListDict } from '../smart-list/selectors';

export const getActiveCampaignAccount = (state: State): any =>
  state.activeCampaign.account.all;

export const getActiveCampaignLinksIds = (state: State): any =>
  state.activeCampaign.links.allIds;

export const getActiveCampaignLinksDict = (state: State): any =>
  state.activeCampaign.links.byId;

export const getActiveCampaignLinks = createSelector(
  [getActiveCampaignLinksDict, getActiveCampaignLinksIds],
  (linksDict, IdList) => Immutable(IdList.map((id) => linksDict[id])),
);

export const withSmartlist = memoize((selector: (State) => any) =>
  createSelector([selector, getSmartListDict], (links, smartListsDict) => {
    if (!Array.isArray(links)) {
      return {
        ...links,
        smartlist: smartListsDict[links.smartlist],
      };
    }
    return links.map((link) => ({
      ...link,
      smartlist: smartListsDict[link.smartlist] || link.smartlist,
    }));
  }),
);

export const getAccount = (state: State): any =>
  state.activeCampaign.account.item;
