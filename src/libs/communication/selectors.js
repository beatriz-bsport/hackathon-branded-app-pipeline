import { createSelector } from 'reselect';
import memoize from 'memoize-one';

const getData = (state) => state.communication.campaign.byId;
const getCampaignBySmartlistIds = (state) =>
  state.communication.campaign.bySmartlist.allIds;

export const getCampaignBySmartlist = createSelector(
  [getCampaignBySmartlistIds, getData],
  (ids, data) => ids.map((id) => data[id]),
);

const getCampaignByMemberIds = (state) =>
  state.communication.campaign.byMember.allIds;

export const getCampaignListByMember = createSelector(
  [getCampaignByMemberIds, getData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getCampaign = (state, id) => state.communication.campaign.byId[id];
export const getCampaignReport = (state) =>
  state.communication.campaign.report.data;

const getRecipientData = (state) => state.communication.recipient.byId;
const getRecipientByCampaignIds = (state) =>
  state.communication.recipient.byCampaign.allIds;

const getRecipientByMemberIds = (state) =>
  state.communication.recipient.byMember.allIds;

export const getRecipientListByCampaign = createSelector(
  [getRecipientData, getRecipientByCampaignIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getRecipientListByMember = createSelector(
  [getRecipientData, getRecipientByMemberIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getCampaignAndRecipientByMember = memoize((state, member) => {
  const campaignList = getCampaignListByMember(state);
  const recipientDataList = Object.values(getRecipientData(state));
  const recipientList = campaignList.map((c) =>
    recipientDataList.find((r) => r.member === member && r.campaign === c.uuid),
  );
  return campaignList.map((c, idx) => [c, recipientList[idx]]);
});
