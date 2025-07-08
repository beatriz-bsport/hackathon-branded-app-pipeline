import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  campaignBySmartlistActions,
  smartlistAutomatedCampaignListActions,
  campaignDetailActions,
  campaignReportActions,
  recipientListActions,
  recipientBulkActions,
  campaignByMemberActions,
  marketingNotificationCampaignDetailActions,
  fetchRecipientListExportLinkActions,
  fetchRecipientsNumberAllCampaignsIncludedActions,
  exportSmartlistCampaignsBackgroundTaskActions,
  fetchLatestCampaignExportLinkActions,
} from '../actions';

import type { MailState, RecipientsNumberAndExportable } from '../types';

const initialState: MailState = Immutable({
  recipient: {
    isloading: false,
    error: null,
    byId: {},
    bulk: {
      loading: false,
      error: null,
    },
    byCampaign: {
      allIds: [],
      loading: false,
      params: { ordering: '' },
      error: null,
      page: null,
      count: 0,
    },
  },
  campaign: {
    byId: {},
    report: {
      data: null,
      loading: false,
      error: null,
    },
    bySmartlist: {
      allIds: [],
      loading: false,
      error: null,
      page: null,
      next_page: null,
      count: 0,
    },
    byMember: {
      allIds: [],
      loading: false,
      error: null,
      page: null,
      next_page: null,
      count: 0,
    },
    export: {
      loading: false,
      error: null,
      link: null,
    },
  },
  automatedCampaign: {
    byId: {},
    bySmartlist: {
      allIds: [],
      loading: false,
      error: null,
      page: null,
      next_page: null,
      count: 0,
    },
  },
  marketingNotification: {
    byId: {},
    loading: false,
    error: null,
  },
  availablePushNotificationRecipient: {
    allIds: [],
    loading: false,
    error: null,
  },
  reportExport: {
    loading: false,
    error: null,
    recipientsCount: 0,
    isExportable: false,
    exportLink: null,
    exportDate: null,
  },
});

export default handleActions(
  {
    [campaignDetailActions.success]: (state, { payload }) => {
      return state.setIn(['campaign', 'byId', payload.uuid], payload);
    },
    [campaignReportActions.success]: (state, { payload }) => {
      return state.setIn(['campaign', 'report', 'data'], payload);
    },
    [campaignReportActions.error]: (state, { payload }) => {
      return state.setIn(['campaign', 'report', 'error'], payload);
    },
    [campaignReportActions.isLoading]: (state, { payload }) => {
      return state.setIn(['campaign', 'report', 'loading'], payload);
    },
    [recipientListActions.error]: (state, { payload }) => {
      return state.setIn(['recipient', 'byCampaign', 'error'], payload);
    },
    [recipientListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['recipient', 'byCampaign', 'loading'], payload);
    },
    [recipientListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['recipient', 'byCampaign', 'allIds'],
          payload.results.map((r) => r.id),
        )
        .setIn(['recipient', 'byCampaign', 'count'], payload.count)
        .setIn(['recipient', 'byCampaign', 'params'], payload.params)
        .setIn(['recipient', 'byCampaign', 'page'], payload.page)
        .merge(
          {
            recipient: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [recipientBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['recipient', 'bulk', 'loading'], payload);
    },
    [recipientBulkActions.error]: (state, { payload }) => {
      return state.setIn(['recipient', 'bulk', 'error'], payload);
    },
    [recipientBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          recipient: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [campaignBySmartlistActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['campaign', 'bySmartlist', 'allIds'],
          payload.page > 1
            ? [
                ...state.campaign.bySmartlist.allIds,
                ...payload.results.map((foo) => foo.uuid),
              ]
            : payload.results.map((foo) => foo.uuid),
        )
        .setIn(['campaign', 'bySmartlist', 'page'], payload.page)
        .setIn(['campaign', 'bySmartlist', 'next_page'], payload.next_page)
        .setIn(['campaign', 'bySmartlist', 'count'], payload.count)
        .merge(
          {
            campaign: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.uuid] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [campaignBySmartlistActions.isLoading]: (state, { payload }) => {
      return state.setIn(['campaign', 'bySmartlist', 'loading'], payload);
    },

    // AUTOMATED CAMPAIGN
    [smartlistAutomatedCampaignListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['automatedCampaign', 'bySmartlist', 'allIds'],
          payload.page > 1
            ? [
                ...state.automatedCampaign.bySmartlist.allIds,
                ...payload.results.map((foo) => foo.uuid),
              ]
            : payload.results.map((foo) => foo.uuid),
        )
        .setIn(['automatedCampaign', 'bySmartlist', 'page'], payload.page)
        .setIn(
          ['automatedCampaign', 'bySmartlist', 'next_page'],
          payload.next_page,
        )
        .setIn(['automatedCampaign', 'bySmartlist', 'count'], payload.count)
        .merge(
          {
            automatedCampaign: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.uuid] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [smartlistAutomatedCampaignListActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['automatedCampaign', 'bySmartlist', 'loading'],
        payload,
      );
    },
    [campaignByMemberActions.reset]: (state) => {
      return state.setIn(['campaign', 'byMember', 'allIds'], []);
    },
    [campaignByMemberActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['campaign', 'byMember', 'allIds'],
          payload.page > 1
            ? [
                ...state.campaign.byMember.allIds,
                ...payload.results.map((foo) => foo.uuid),
              ]
            : payload.results.map((foo) => foo.uuid),
        )
        .setIn(['campaign', 'byMember', 'page'], payload.page)
        .setIn(['campaign', 'byMember', 'next_page'], payload.next_page)
        .setIn(['campaign', 'byMember', 'count'], payload.count)
        .merge(
          {
            campaign: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.uuid] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [campaignByMemberActions.isLoading]: (state, { payload }) => {
      return state.setIn(['campaign', 'byMember', 'loading'], payload);
    },
    [campaignByMemberActions.error]: (state, { payload }) => {
      return state.setIn(['campaign', 'byMember', 'error'], payload);
    },
    [marketingNotificationCampaignDetailActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['marketingNotification', 'loading'], payload);
    },
    [marketingNotificationCampaignDetailActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(['marketingNotification', 'error'], payload);
    },
    [marketingNotificationCampaignDetailActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['marketingNotification', 'byId', payload.id],
        payload,
      );
    },
    [fetchRecipientListExportLinkActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['campaign', 'export', 'loading'], payload);
    },
    [fetchRecipientListExportLinkActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['campaign', 'export', 'error'], payload);
    },
    [fetchRecipientListExportLinkActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['campaign', 'export', 'link'], payload);
    },

    [fetchRecipientsNumberAllCampaignsIncludedActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportExport', 'loading'], payload);
    },
    [fetchRecipientsNumberAllCampaignsIncludedActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportExport', 'error'], payload);
    },
    [fetchRecipientsNumberAllCampaignsIncludedActions.success.toString()]: (
      state,
      { payload }: { payload: RecipientsNumberAndExportable },
    ) => {
      return state
        .setIn(['reportExport', 'recipientsCount'], payload.recipient_count)
        .setIn(['reportExport', 'isExportable'], payload.xlsx_exportable);
    },
    [exportSmartlistCampaignsBackgroundTaskActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportExport', 'loading'], payload);
    },
    [exportSmartlistCampaignsBackgroundTaskActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportExport', 'error'], payload);
    },
    [exportSmartlistCampaignsBackgroundTaskActions.success.toString()]: (
      state,
    ) => {
      return state.setIn(['reportExport', 'error'], null);
    },

    [fetchLatestCampaignExportLinkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['reportExport', 'loading'], payload);
    },
    [fetchLatestCampaignExportLinkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['reportExport', 'error'], payload);
    },
    [fetchLatestCampaignExportLinkActions.success.toString()]: (
      state,
      { payload }: { payload: { link: string, date: string } },
    ) => {
      return state
        .setIn(['reportExport', 'exportDate'], payload.date)
        .setIn(['reportExport', 'exportLink'], payload.link);
    },
  },
  initialState,
);
