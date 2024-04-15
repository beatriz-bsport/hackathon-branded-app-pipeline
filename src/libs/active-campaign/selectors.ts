import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import Immutable from 'seamless-immutable';
import type { RootState } from 'src/reducers';
import { getSmartListDict } from '#libs/smart-list/selectors';
import type { Account, Link, LinkApi, LinkState } from './types';

export const getActiveCampaignAccount = (state: RootState) =>
  state.activeCampaign.account.item;

export const getActiveCampaignLinksIds = (
  state: RootState,
): LinkState['allIds'] => state.activeCampaign.links.allIds;

export const getActiveCampaignLinksDict = (
  state: RootState,
): LinkState['byId'] => state.activeCampaign.links.byId;

export const getActiveCampaignLinks = createSelector(
  [getActiveCampaignLinksDict, getActiveCampaignLinksIds],
  (linksDict, IdList) => Immutable(IdList.map((id: number) => linksDict[id])),
);

export const withSmartlist = memoize(
  (selector: (state: RootState) => Immutable.ImmutableArray<LinkApi>) =>
    createSelector([selector, getSmartListDict], (links, smartListsDict) => {
      return links.map((link) => {
        const newLink: Link = {
          ...link,
          smartlist: smartListsDict[link.smartlist],
        };
        return newLink;
      });
    }),
);

export const getAccount = (state: RootState): Account =>
  state.activeCampaign.account.item;
