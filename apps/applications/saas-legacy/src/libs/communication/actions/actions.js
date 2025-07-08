import { createAction } from 'redux-actions';
import {
  fetchCampaign as fetchCampaignAPI,
  fetchCampaignReport as fetchCampaignReportAPI,
  fetchCampaignList as fetchCampaignListAPI,
  fetchRecipientList as fetchRecipientListAPI,
  fetchCampaignSummary as fetchCampaignSummaryAPI,
  fetchRecipientListExport as fetchRecipientListExportAPI,
  fetchRecipientListExportLink as fetchRecipientListExportLinkAPI,
  fetchRecipientsNumberAllCampaignsIncluded as fetchRecipientsNumberAllCampaignsIncludedAPI,
  exportSmartlistCampaignsBackgroundTask as exportSmartlistCampaignsBackgroundTaskAPI,
  fetchLatestCampaignExportLink as fetchLatestCampaignExportLinkAPI,
} from '../api';

import type {
  Dispatch,
  ThunkAction,
  OptionCallback,
  OptionBackgroundCallback,
} from '../../../state/types';
import type { CampaignExportStartEndDates } from '../types';

import { snackbarError } from '../../snackbar/actions';
import { monitorBackgroundTask } from '../../background-task/actions';

export const campaignBySmartlistActions = {
  error: createAction('CAMPAIGN/LIST/ERROR'),
  isLoading: createAction('CAMPAIGN/LIST/LOADING'),
  success: createAction('CAMPAIGN/LIST/SUCCESS'),
};

export function fetchCampaignSmartlist(
  smartlist: number,
  page: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignBySmartlistActions.isLoading(true));
    dispatch(campaignBySmartlistActions.error(null));
    try {
      const response = await fetchCampaignListAPI({
        smartlist,
        page,
        no_automated_campaign: true,
        without_member_info: true,
      });
      dispatch(campaignBySmartlistActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(campaignBySmartlistActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignBySmartlistActions.isLoading(false));
  };
}
export const smartlistAutomatedCampaignListActions = {
  error: createAction('AUTOMATED_CAMPAIGN/LIST/ERROR'),
  isLoading: createAction('AUTOMATED_CAMPAIGN/LIST/LOADING'),
  success: createAction('AUTOMATED_CAMPAIGN/LIST/SUCCESS'),
};

export function fetchCampaignSmartlistAutomated(
  smartlist: number,
  page: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(smartlistAutomatedCampaignListActions.isLoading(true));
    dispatch(smartlistAutomatedCampaignListActions.error(null));
    try {
      const response = await fetchCampaignListAPI({
        smartlist,
        page,
        only_automated_campaign: true,
        without_member_info: true,
      });
      dispatch(
        smartlistAutomatedCampaignListActions.success({
          ...response.data,
          page,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(smartlistAutomatedCampaignListActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(smartlistAutomatedCampaignListActions.isLoading(false));
  };
}

export const recipientListActions = {
  error: createAction('RECIPIENT/LIST/ERROR'),
  isLoading: createAction('RECIPIENT/LIST/LOADING'),
  success: createAction('RECIPIENT/LIST/SUCCESS'),
};

export function fetchRecipientByCampaign(
  campaign: string,
  page: number,
  params: any = {},
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientListActions.isLoading(true));
    dispatch(recipientListActions.error(null));
    try {
      const response = await fetchRecipientListAPI({
        page,
        campaign,
        page_size: 15,
        ...params,
      });
      dispatch(
        recipientListActions.success({ ...response.data, page, params }),
      );
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(recipientListActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(recipientListActions.isLoading(false));
  };
}

export const campaignDetailActions = {
  error: createAction('CAMPAIGN/DETAIL/ERROR'),
  isLoading: createAction('CAMPAIGN/DETAIL/LOADING'),
  success: createAction('CAMPAIGN/DETAIL/SUCCESS'),
};

export function fetchCampaign(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignDetailActions.isLoading(true));
    dispatch(campaignDetailActions.error(null));
    try {
      const response = await fetchCampaignAPI(id);
      dispatch(campaignDetailActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(campaignDetailActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignDetailActions.isLoading(false));
  };
}

export const marketingNotificationCampaignDetailActions = {
  error: createAction('MARKETING_NOTIFICATION_CAMPAIGN/DETAIL/ERROR'),
  isLoading: createAction('MARKETING_NOTIFICATION_CAMPAIGN/DETAIL/LOADING'),
  success: createAction('MARKETING_NOTIFICATION_CAMPAIGN/DETAIL/SUCCESS'),
};

export function fetchMarketingNotificationCampaignSummary(
  id: string | number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(marketingNotificationCampaignDetailActions.isLoading(true));
    dispatch(marketingNotificationCampaignDetailActions.error(null));
    try {
      const response = await fetchCampaignSummaryAPI({
        key: 'marketing_notification_id',
        value: id,
      });

      const data = {
        id,
        ...response.data,
      };

      dispatch(marketingNotificationCampaignDetailActions.success(data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(marketingNotificationCampaignDetailActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(marketingNotificationCampaignDetailActions.isLoading(false));
  };
}

export const campaignReportActions = {
  error: createAction('CAMPAIGN/REPORT/ERROR'),
  isLoading: createAction('CAMPAIGN/REPORT/LOADING'),
  success: createAction('CAMPAIGN/REPORT/SUCCESS'),
};

export function fetchCampaignReport(
  id: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(campaignReportActions.isLoading(true));
    dispatch(campaignReportActions.error(null));
    try {
      const response = await fetchCampaignReportAPI(id);
      dispatch(campaignReportActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(campaignReportActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignReportActions.isLoading(false));
  };
}

export const campaignByMemberActions = {
  error: createAction('CAMPAIGN/BY_MEMBER/ERROR'),
  isLoading: createAction('CAMPAIGN/BY_MEMBER/LOADING'),
  success: createAction('CAMPAIGN/BY_MEMBER/SUCCESS'),
  reset: createAction('CAMPAIGN/BY_MEMBER/RESET'),
};

export function fetchCampaignByMember(
  member: number,
  page: number,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    if (page === 1) {
      campaignByMemberActions.reset();
    }
    dispatch(campaignByMemberActions.isLoading(true));
    dispatch(campaignByMemberActions.error(null));
    try {
      const response = await fetchCampaignListAPI({
        member,
        page,
        page_size: 6,
      });
      dispatch(campaignByMemberActions.success({ ...response.data, page }));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.results);
      }
    } catch (error) {
      dispatch(campaignByMemberActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(campaignByMemberActions.isLoading(false));
  };
}

export const recipientBulkActions = {
  error: createAction('RECIPIENT/BULK/ERROR'),
  isLoading: createAction('RECIPIENT/BULK/LOADING'),
  success: createAction('RECIPIENT/BULK/SUCCESS'),
};

export function fetchRecipientBulk(
  member: number,
  campaign_ids: Array<string>,
  options: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientBulkActions.isLoading(true));
    dispatch(recipientBulkActions.error(null));
    try {
      const response = await fetchRecipientListAPI({
        member,
        campaign__in: campaign_ids,
        page_size: null,
      });
      dispatch(recipientBulkActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(recipientBulkActions.error(error));
      console.error(error);
      if (options && options.onError) options.onError(error);
    }
    dispatch(recipientBulkActions.isLoading(false));
  };
}

export const fetchRecipientListExportActions = {
  error: createAction('SMART-LIST/CAMPAIGN_EXPORT_BACKGROUND/ERROR'),
  isLoading: createAction('SMART-LIST/CAMPAIGN_EXPORT_BACKGROUND/IS_LOADING'),
  success: createAction('SMARTLIST/CAMPAIGN_EXPORT_BACKGROUND/SUCCESS'),
};

export function fetchRecipientListExport(id, options) {
  return async (dispatch) => {
    dispatch(fetchRecipientListExportActions.isLoading(true));
    dispatch(fetchRecipientListExportActions.error(null));
    try {
      const response = await fetchRecipientListExportAPI(id);
      dispatch(fetchRecipientListExportActions.success(response));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
        }),
      );
      if (options && options?.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      dispatch(fetchRecipientListExportActions.error(err));
      if (options && options.onError) {
        options.onError();
      }
      dispatch(snackbarError('communication:campaign.report.exportError'));
    }
    dispatch(fetchRecipientListExportActions.isLoading(false));
  };
}

export const fetchRecipientListExportLinkActions = {
  error: createAction('SMART-LIST/FETCH_CAMPAIGN_EXPORT_BACKGROUND/ERROR'),
  isLoading: createAction(
    'SMART-LIST/FETCH_CAMPAIGN_EXPORT_BACKGROUND/LOADING',
  ),
  success: createAction('SMART-LIST/FETCH_CAMPAIGN_EXPORT_BACKGROUND/SUCCESS'),
};

export function fetchRecipientListExportLink(id, options) {
  return async (dispatch) => {
    dispatch(fetchRecipientListExportLinkActions.isLoading(true));
    dispatch(fetchRecipientListExportLinkActions.error(null));
    try {
      const response = await fetchRecipientListExportLinkAPI(id);
      dispatch(fetchRecipientListExportLinkActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(fetchRecipientListExportLinkActions.error(error));
      if (options && options.onError) {
        options.onError();
      }
    }
    dispatch(fetchRecipientListExportLinkActions.isLoading(false));
  };
}

export const fetchRecipientsNumberAllCampaignsIncludedActions = {
  error: createAction(
    'SMART-LIST/FETCH_RECIPIENTS_NUMBER_ALL_CAMPAIGNS_INCLUDED/ERROR',
  ),
  isLoading: createAction(
    'SMART-LIST/FETCH_RECIPIENTS_NUMBER_ALL_CAMPAIGNS_INCLUDED/LOADING',
  ),
  success: createAction(
    'SMART-LIST/FETCH_RECIPIENTS_NUMBER_ALL_CAMPAIGNS_INCLUDED/SUCCESS',
  ),
};

export function fetchRecipientsNumberAllCampaignsIncluded(
  data: { smartlistId: number, dates: CampaignExportStartEndDates },
  options: OptionCallback<boolean>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchRecipientsNumberAllCampaignsIncludedActions.isLoading(true));
    dispatch(fetchRecipientsNumberAllCampaignsIncludedActions.error(null));
    try {
      const response = await fetchRecipientsNumberAllCampaignsIncludedAPI(data);
      dispatch(
        fetchRecipientsNumberAllCampaignsIncludedActions.success(
          response?.data,
        ),
      );
      options?.onSuccess?.({
        isExportable: response?.data?.xlsx_exportable,
      });
      dispatch(
        fetchRecipientsNumberAllCampaignsIncludedActions.isLoading(false),
      );
    } catch (error) {
      dispatch(fetchRecipientsNumberAllCampaignsIncludedActions.error(error));
      console.error(error);
      options?.onError?.(error);
    }
    dispatch(fetchRecipientsNumberAllCampaignsIncludedActions.isLoading(false));
  };
}

export const exportSmartlistCampaignsBackgroundTaskActions = {
  error: createAction(
    'SMART-LIST/ALL_CAMPAIGNS_REPORT_EXPORT_BACKGROUND/ERROR',
  ),
  isLoading: createAction(
    'SMART-LIST/ALL_CAMPAIGNS_REPORT_EXPORT_BACKGROUND/LOADING',
  ),
  success: createAction(
    'SMART-LIST/ALL_CAMPAIGNS_REPORT_EXPORT_BACKGROUND/SUCCESS',
  ),
};

export function exportSmartlistCampaignsBackgroundTask(
  data: { smartlistId: number, dates: CampaignExportStartEndDates },
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportSmartlistCampaignsBackgroundTaskActions.isLoading(true));
    dispatch(exportSmartlistCampaignsBackgroundTaskActions.error(null));
    try {
      const response = await exportSmartlistCampaignsBackgroundTaskAPI(data);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: (error) => {
            dispatch(
              exportSmartlistCampaignsBackgroundTaskActions.error(error),
            );
            options?.onBackgroundError?.();
          },
        }),
      );
      dispatch(exportSmartlistCampaignsBackgroundTaskActions.success());
      options?.onSuccess();
    } catch (err) {
      dispatch(exportSmartlistCampaignsBackgroundTaskActions.error(err));
      options?.onError?.(err);
    }
    dispatch(exportSmartlistCampaignsBackgroundTaskActions.isLoading(false));
  };
}

export const fetchLatestCampaignExportLinkActions = {
  error: createAction('SMART-LIST/LATEST_CAMPAIGN_EXPORT_LINK/ERROR'),
  isLoading: createAction('SMART-LIST/LATEST_CAMPAIGN_EXPORT_LINK/LOADING'),
  success: createAction('SMART-LIST/LATEST_CAMPAIGN_EXPORT_LINK/SUCCESS'),
};

export function fetchLatestCampaignExportLink(
  smartlistId: number,
  options?: OptionCallback<string>,
) {
  // the data is formatted with the date of the generation of the csv in this format 'date_created|export_link'
  return async (dispatch: Dispatch) => {
    dispatch(fetchLatestCampaignExportLinkActions.isLoading(true));
    dispatch(fetchLatestCampaignExportLinkActions.error(null));
    try {
      const response = await fetchLatestCampaignExportLinkAPI(smartlistId);
      if (response.data.includes('|')) {
        const dateAndLink = response.data.split('|');
        dispatch(
          fetchLatestCampaignExportLinkActions.success({
            date: dateAndLink[0],
            link: dateAndLink[1],
          }),
        );
      }
      options?.onSuccess?.(response.data);
    } catch (err) {
      dispatch(fetchLatestCampaignExportLinkActions.error(err));
      console.error(err);
      options?.onError?.(err);
    }
    dispatch(fetchLatestCampaignExportLinkActions.isLoading(false));
  };
}
