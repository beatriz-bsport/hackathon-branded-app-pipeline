import type { PaginatedResponse } from '../../state/types';
import {
  postAuth,
  getAuth,
  buildUrlParams,
  deleteAuth,
  patchAuth,
} from '../../http';
import type {
  CommunicationSentGroupConfig,
  CommunicationSentGroup,
  SendGroupedCommunicationData,
  CommunicationSentGroupReport,
  FetchRecipientListByCommunicationSentGroupRealParams,
  FetchCommunicationSentGroupConfigCommunicationSentGroupParams,
  Recipient,
  RecipientsNumberAndExportable,
  CampaignExportStartEndDates,
  CampaignListParams,
  CommunicationSentGroupConfigQueryParams,
  MarketingPreferenceData,
  MarketingPreferenceUpdatePayload,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_COMMUNICATE_V1;
const API_V1_URI_CDP = Config.REACT_APP_BASE_URI_CDP_V1;

export const fetchCampaignList = (params: CampaignListParams) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/${buildUrlParams(params)}`,
  );
};

export const fetchCampaignReport = (id: number) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/${id}/report/`,
  );
};

export const fetchCampaignSummary = (params: { id: number }) => {
  return postAuth(
    `${API_V1_URI}/communication/communication_sent/campaign_summary/`,
    params,
  );
};

export const fetchCampaign = (id: number) => {
  return getAuth(`${API_V1_URI}/communication/communication_sent/${id}/`);
};

export const fetchRecipientList = (params: any) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_recipient/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchRecipientListExport = (id: string) => {
  return postAuth(
    `${API_V1_URI}/communication/communication_sent/${id}/export-campaign-async/`,
  );
};

export const fetchRecipientListExportLink = (id: string) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/${id}/get-export/`,
  );
};

export const createCommunicationSentGroupConfig = (
  data: CommunicationSentGroupConfig,
) => {
  return postAuth<CommunicationSentGroupConfig>(
    `${API_V1_URI}/communication/communication-sent-group-config/`,
    data,
  );
};

export const updateCommunicationSentGroupConfig = (
  id: number,
  data: CommunicationSentGroupConfig,
) => {
  return patchAuth<CommunicationSentGroupConfig>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/`,
    data,
  );
};

export const deleteCommunicationSentGroupConfig = (id: number) => {
  return deleteAuth<CommunicationSentGroupConfig>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/`,
  );
};

export const duplicateCommunicationSentGroupConfig = (id: number) => {
  return postAuth<CommunicationSentGroupConfig>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/create_copy/`,
  );
};

export const fetchCommunicationSentGroupConfigsList = (
  params?: CommunicationSentGroupConfigQueryParams,
) => {
  return getAuth<PaginatedResponse<CommunicationSentGroupConfig>>(
    `${API_V1_URI}/communication/communication-sent-group-config/${buildUrlParams(
      params,
    )}`,
  );
};

export const sendGroupedCommunication = (
  data: SendGroupedCommunicationData,
) => {
  return postAuth<number, SendGroupedCommunicationData>(
    `${API_V1_URI}/communication/communication-sent-group/send-communication-from-group/`,
    data,
  );
};

export const fetchCommunicationSentGroupConfigDetail = (id: number) => {
  return getAuth<CommunicationSentGroupConfig>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/`,
  );
};

export const fetchCommunicationSentGroupConfigCommunicationSentGroupList = (
  params: FetchCommunicationSentGroupConfigCommunicationSentGroupParams,
) => {
  return getAuth<PaginatedResponse<CommunicationSentGroup>>(
    `${API_V1_URI}/communication/communication-sent-group/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchCommunicationSentGroupDetails = (id: number) => {
  return getAuth<CommunicationSentGroup>(
    `${API_V1_URI}/communication/communication-sent-group/${id}/`,
  );
};

export const fetchRecipientListByCommunicationSentGroup = (
  params: FetchRecipientListByCommunicationSentGroupRealParams & {
    page_size: number;
  },
) => {
  return getAuth<PaginatedResponse<Recipient>>(
    `${API_V1_URI}/communication/communication_recipient/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchCommunicationSentGroupReport = (id: number) => {
  return getAuth<CommunicationSentGroupReport>(
    `${API_V1_URI}/communication/communication-sent-group/${id}/report/`,
  );
};

export const fetchMembersDataTableListExport = (id: number) => {
  return postAuth<string>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/export-users-background-xlsx/`,
  );
};

export const fetchMembersDataTableListExportLink = (id: number) => {
  return getAuth<string>(
    `${API_V1_URI}/communication/communication-sent-group-config/${id}/get-xlsx-export/`,
  );
};

export const fetchCommunicationSentGroupRecipientListExport = (id: number) => {
  return postAuth<string>(
    `${API_V1_URI}/communication/communication-sent-group/${id}/export-communication-sent-group-async/`,
  );
};

export const fetchCommunicationSentGroupRecipientListExportLink = (
  id: number,
) => {
  return getAuth<string>(
    `${API_V1_URI}/communication/communication-sent-group/${id}/get-export/`,
  );
};

export const fetchRecipientsNumberAllCampaignsIncluded = ({
  smartlistId,
  dates,
}: {
  smartlistId: number;
  dates: CampaignExportStartEndDates;
}) => {
  return getAuth<RecipientsNumberAndExportable>(
    `${API_V1_URI_CDP}/smartlist/group/${smartlistId}/recipient-count/${buildUrlParams(
      dates,
    )}`,
  );
};

export const exportSmartlistCampaignsBackgroundTask = ({
  smartlistId,
  dates,
}: {
  smartlistId: number;
  dates: CampaignExportStartEndDates;
}) => {
  return postAuth(
    `${API_V1_URI_CDP}/smartlist/group/${smartlistId}/export-campaigns-background/${buildUrlParams(
      dates,
    )}`,
  );
};

export const fetchLatestCampaignExportLink = (smartlistId: number) => {
  return getAuth<string>(
    `${API_V1_URI_CDP}/smartlist/group/${smartlistId}/latest_campaign_export_link/`,
  );
};

/**
 * Fetches marketing preferences for the authenticated user in a specific franchise
 *
 * @param franchise_id - The ID of the franchise to fetch preferences for
 * @returns Promise resolving to an array of marketing preferences
 */
export const fetchMyFranchiseMarketingPreferences = (
  franchise_id: number,
  unsubscribe_uuid?: string,
) => {
  if (!!unsubscribe_uuid) {
    return getAuth<MarketingPreferenceData[]>(
      `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/${buildUrlParams(
        { unsubscribe_uuid },
      )}`,
    );
  }
  return getAuth<MarketingPreferenceData[]>(
    `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/`,
  );
};

/**
 * Updates marketing preferences for the authenticated user in a specific franchise
 *
 * @param franchise_id - The ID of the franchise to update preferences for
 * @param payload - Array of marketing preference updates
 * @returns Promise resolving to the update result
 */
export const updateMyFranchiseMarketingPreferences = (
  franchise_id: number,
  payload: MarketingPreferenceUpdatePayload[],
  unsubscribe_uuid?: string,
) => {
  if (!!unsubscribe_uuid) {
    return postAuth(
      `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/update_preferences/${buildUrlParams(
        { unsubscribe_uuid },
      )}`,
      payload,
    );
  }
  return postAuth(
    `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/update_preferences/`,
    payload,
  );
};

/**
 * Checks if marketing preferences are enabled for a specific franchise
 *
 * @param franchise_id - The ID of the franchise to check eligibility for
 * @returns Promise resolving to the eligibility status
 */
export const checkFranchiseMarketingPreferencesEligibility = (
  franchise_id: number,
  unsubscribe_uuid?: string,
) => {
  if (!!unsubscribe_uuid) {
    return getAuth(
      `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/eligible/${buildUrlParams(
        { unsubscribe_uuid },
      )}`,
    );
  }
  return getAuth(
    `${API_V1_URI}/communication/marketing-preferences/franchise/${franchise_id}/eligible/`,
  );
};
