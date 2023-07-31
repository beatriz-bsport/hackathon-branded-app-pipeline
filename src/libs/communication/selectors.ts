import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { _getAutomatedCampaignById } from '#libs/smart-list/selectors';
import { Campaign } from '#libs/communication/types';
import { RootState } from '../../reducers';

const getData = (state: RootState) => state.communication.campaign.byId;
const getAutomatedData = (state: RootState) =>
  state.communication.automatedCampaign.byId;
const getCampaignBySmartlistIds = (state: RootState) =>
  state.communication.campaign.bySmartlist.allIds;
const getAutomatedCampaignBySmartlistIds = (state: RootState) =>
  state.communication.automatedCampaign.bySmartlist.allIds;

export const getCampaignBySmartlist = createSelector(
  [getCampaignBySmartlistIds, getData],
  (ids, data) => ids.map((id) => data[id]),
);
export const getAutomatedCampaignBySmartlist = createSelector(
  [getAutomatedCampaignBySmartlistIds, getAutomatedData],
  (ids, data) => ids.map((id) => data[id]),
);

const getCampaignByMemberIds = (state: RootState) =>
  state.communication.campaign.byMember.allIds;

export const getCampaignListByMember = createSelector(
  [getCampaignByMemberIds, getData],
  (ids, data) => ids.map((id) => data[id]),
);

export const getCampaign = (state: RootState, id: number) =>
  state.communication.campaign.byId[id];

export const getCampaignReport = (state: RootState) =>
  state.communication.campaign.report.data;

const getRecipientData = (state: RootState) =>
  state.communication.recipient.byId;

const getRecipientByCampaignIds = (state: RootState) =>
  state.communication.recipient.byCampaign.allIds;

export const getRecipientListByCampaign = createSelector(
  [getRecipientData, getRecipientByCampaignIds],
  (data, ids) => ids.map((id: number) => data[id]),
);

export const getCampaignAndRecipientByMember = memoize(
  (state: RootState, member: number) => {
    const campaignList = getCampaignListByMember(state);
    const recipientDataList = Object.values(getRecipientData(state));
    const recipientList = campaignList.map((c) =>
      recipientDataList.find(
        (r) => r.member === member && r.campaign === c.uuid,
      ),
    );
    return campaignList.map((c, idx) => [c, recipientList[idx]]);
  },
);

export const getAvailableRecipientNotification = (state: RootState) =>
  state.communication.availablePushNotificationRecipient.allIds;

export const withAutomatedCampaign = memoize(
  (selector: (State: RootState) => any) =>
    createSelector(
      [selector, _getAutomatedCampaignById],
      (campaignObjects, automatedCampaignData) => {
        if (!campaignObjects) return campaignObjects;
        if (Array.isArray(campaignObjects)) {
          return campaignObjects.map((campaign: Campaign) => ({
            ...campaign,
            automated_campaign: campaign?.metadata?.automated_campaign_id
              ? automatedCampaignData[campaign?.metadata?.automated_campaign_id]
              : null,
          }));
        }
        return {
          ...campaignObjects,
          automated_campaign: campaignObjects?.metadata?.automated_campaign_id
            ? automatedCampaignData[
                campaignObjects?.metadata?.automated_campaign_id
              ]
            : null,
        };
      },
    ),
);
