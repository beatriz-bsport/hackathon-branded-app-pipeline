import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import { _getAutomatedCampaignById } from '#src/libs/smart-list/selectors';
import {
  Campaign,
  CommunicationSentGroupConfig,
  CommunicationSentGroup,
} from '#src/libs/communication/types';
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

export const withAutomatedCampaign = memoize(
  (selector: (State: RootState) => Campaign | Campaign[]) =>
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

const _getCommunicationSentGroupConfigState = (state: RootState) =>
  state.communicationSentGroupConfig;
export const getCommunicationSentGroupConfigConfigById = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroupConfig
    .byId;

export const getCommunicationSentGroupConfigAllIds = (
  state: RootState,
): number[] =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroupConfig
    .allIds;

export const getCommunicationSentGroupById = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroup.byId;

export const getCommunicationSentGroupAllIds = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroup.allIds;

export const getAllCommunicationSentGroupConfigs = createSelector(
  [
    getCommunicationSentGroupConfigConfigById,
    getCommunicationSentGroupConfigAllIds,
  ],
  (communicationSentGroupConfig, idList) => {
    return Immutable(
      idList.map((id: number) => communicationSentGroupConfig[id]),
    );
  },
);

const getCommunicationGroupRecipientData = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.byId;

const getCommunicationGroupRecipientParams = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.params;

const getCommunicationGroupRecipientCount = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.count;

const getCommunicationGroupRecipientLoading = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.loading;

const getCommunicationGroupRecipientPage = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.page;

const getCommunicationGroupRecipientError = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.error;

const getRecipientByCommunicationSentGroupIds = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).recipient.allIds;

const _getCommunicationSentGroupConfigsPaginatedState = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state)
    .communicationSentGroupConfigPaginated;

export const getCommunicationSentGroupConfigsPaginated = createSelector(
  [_getCommunicationSentGroupConfigsPaginatedState],
  (paginatedState) => {
    const { allIds, byId } = paginatedState;
    return {
      ...paginatedState,
      items: allIds.map((id) => byId[id]).filter((item) => !!item),
    };
  },
);
export const getCommunicationGroupRecipientPaginationData = createSelector(
  [
    getCommunicationGroupRecipientParams,
    getCommunicationGroupRecipientLoading,
    getCommunicationGroupRecipientCount,
    getCommunicationGroupRecipientPage,
    getCommunicationGroupRecipientError,
  ],
  (params, loading, count, page, error) => {
    return { count, loading, page, params, error };
  },
);

export const getRecipientListByCommunicationSentGroup = createSelector(
  [getCommunicationGroupRecipientData, getRecipientByCommunicationSentGroupIds],
  (data, ids) => ids.map((id: number) => data[id]),
);
export const getCommunicationSentGroupConfig = (
  state: RootState,
  id: number,
): CommunicationSentGroupConfig => {
  return _getCommunicationSentGroupConfigState(state)
    .communicationSentGroupConfig.byId[id];
};

export const getCommunicationSentGroupConfigFromPaginatedState = (
  state: RootState,
  id: number,
) =>
  _getCommunicationSentGroupConfigState(state)
    .communicationSentGroupConfigPaginated.byId[id];

export const getCommunicationSentGroup = (
  state: RootState,
  id: number,
): CommunicationSentGroup =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroup.byId[id];

export const getAllCommunicationSentGroup = createSelector(
  [getCommunicationSentGroupById, getCommunicationSentGroupAllIds],
  (communicationSentGroup, idList) => {
    return Immutable(idList.map((id: number) => communicationSentGroup[id]));
  },
);

export const getCommunicationSentGroupReport = (state: RootState) =>
  _getCommunicationSentGroupConfigState(state).communicationSentGroup.report
    .data;

export const _getReportExportState = (state: RootState) =>
  state.communication.reportExport;

export const getCsvExportAllCampaignsLink = (state: RootState): string | null =>
  _getReportExportState(state)?.exportLink;

export const getCsvExportAllCampaignsDate = (state: RootState): string | null =>
  _getReportExportState(state)?.exportDate;

export const getCsvExportAllCampaignsRecipientCount = (
  state: RootState,
): number | null => _getReportExportState(state)?.recipientsCount;

export const getCsvExportAllCampaignsIsXlsxExportable = (
  state: RootState,
): boolean => _getReportExportState(state)?.isExportable;

export const getCsvExportAllCampaignsIsLoading = (state: RootState): boolean =>
  _getReportExportState(state)?.loading;
