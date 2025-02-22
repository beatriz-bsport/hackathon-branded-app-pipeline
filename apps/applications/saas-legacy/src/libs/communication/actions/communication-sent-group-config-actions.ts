import { createAction } from 'redux-actions';
import { Recipient } from '#src/libs/communication/types';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import type {
  Dispatch,
  OptionBackgroundCallback,
  OptionCallback,
  PaginatedResponse,
  ThunkAction,
} from '../../../state/types';
import type {
  CommunicationSentGroupConfigQueryParams,
  CommunicationSentGroupConfig,
  CommunicationSentGroup,
  SendGroupedCommunicationData,
  FetchCommunicationSentGroupConfigCommunicationSentGroupParams,
  FetchRecipientListByCommunicationSentGroupParams,
  CommunicationSentGroupReport,
} from '../types';
import { snackbarSuccess, snackbarError } from '../../snackbar/actions';
import {
  sendGroupedCommunication as sendGroupedCommunicationAPI,
  fetchCommunicationSentGroupConfigsList as fetchCommunicationSentGroupConfigsListAPI,
  createCommunicationSentGroupConfig as createCommunicationSentGroupConfigAPI,
  updateCommunicationSentGroupConfig as updateCommunicationSentGroupConfigAPI,
  deleteCommunicationSentGroupConfig as deleteCommunicationSentGroupConfigAPI,
  duplicateCommunicationSentGroupConfig as duplicateCommunicationSentGroupConfigAPI,
  fetchCommunicationSentGroupConfigDetail as fetchCommunicationSentGroupConfigDetailAPI,
  fetchCommunicationSentGroupConfigCommunicationSentGroupList as fetchCommunicationSentGroupConfigCommunicationSentGroupListAPI,
  fetchRecipientListByCommunicationSentGroup as fetchRecipientListByCommunicationSentGroupAPI,
  fetchCommunicationSentGroupDetails as fetchCommunicationSentGroupDetailsAPI,
  fetchCommunicationSentGroupReport as fetchCommunicationSentGroupReportAPI,
  fetchMembersDataTableListExport as fetchMembersDataTableListExportAPI,
  fetchMembersDataTableListExportLink as fetchMembersDataTableListExportLinkAPI,
  fetchCommunicationSentGroupRecipientListExport as fetchCommunicationSentGroupRecipientListExportAPI,
  fetchCommunicationSentGroupRecipientListExportLink as fetchCommunicationSentGroupRecipientListExportLinkAPI,
} from '../api';
import { FRANCHISE_COMMUNICATION_SENT_GROUP_PAGINATION_SIZE } from '#src/libs/communication/constants';

import type { RootState } from '#src/reducers';
export const createCommunicationSentGroupConfigAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/CREATE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/CREATE/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig>(
    'COMMUNICATION-SENT-GROUP-CONFIG/CREATE/SUCCESS',
  ),
};

export function createCommunicationSentGroupConfig(
  data: CommunicationSentGroupConfig,
  options: OptionCallback<CommunicationSentGroupConfig>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(createCommunicationSentGroupConfigAction.isLoading(true));
    dispatch(createCommunicationSentGroupConfigAction.error(null));
    try {
      const response = await createCommunicationSentGroupConfigAPI(data);
      dispatch(createCommunicationSentGroupConfigAction.success(response.data));
      dispatch(snackbarSuccess('communicationSentGroupConfig.create.success'));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(createCommunicationSentGroupConfigAction.error(error));
      dispatch(snackbarError('communicationSentGroupConfig.create.error'));

      options?.onError?.();
    }
    dispatch(createCommunicationSentGroupConfigAction.isLoading(false));
  };
}

export const updateCommunicationSentGroupConfigAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/UPDATE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/UPDATE/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig>(
    'COMMUNICATION-SENT-GROUP-CONFIG/UPDATE/SUCCESS',
  ),
};

export function updateCommunicationSentGroupConfig(
  id: number,
  data: CommunicationSentGroupConfig,
  options?: OptionCallback<CommunicationSentGroupConfig>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(updateCommunicationSentGroupConfigAction.isLoading(true));
    dispatch(updateCommunicationSentGroupConfigAction.error(null));
    try {
      const response = await updateCommunicationSentGroupConfigAPI(id, data);
      dispatch(updateCommunicationSentGroupConfigAction.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateCommunicationSentGroupConfigAction.error(error));

      options?.onError?.();
    }
    dispatch(updateCommunicationSentGroupConfigAction.isLoading(false));
  };
}

export const deleteCommunicationSentGroupConfigAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DELETE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DELETE/IS_LOADING',
  ),
  success: createAction<number>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DELETE/SUCCESS',
  ),
};

export function deleteCommunicationSentGroupConfig(
  id: number,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(deleteCommunicationSentGroupConfigAction.isLoading(true));
    dispatch(deleteCommunicationSentGroupConfigAction.error(null));
    try {
      await deleteCommunicationSentGroupConfigAPI(id);
      dispatch(snackbarSuccess('communicationSentGroupConfig.delete.success'));
      dispatch(deleteCommunicationSentGroupConfigAction.success(id));

      options?.onSuccess?.();
    } catch (error) {
      dispatch(snackbarError('communicationSentGroupConfig.delete.error'));
      dispatch(deleteCommunicationSentGroupConfigAction.error(error));

      options?.onError?.();
    }
    dispatch(deleteCommunicationSentGroupConfigAction.isLoading(false));
  };
}

export const duplicateCommunicationSentGroupConfigAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DUPLICATE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DUPLICATE/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DUPLICATE/SUCCESS',
  ),
};

export function duplicateCommunicationSentGroupConfig(
  id: number,
  options?: OptionCallback<CommunicationSentGroupConfig>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(duplicateCommunicationSentGroupConfigAction.isLoading(true));
    dispatch(duplicateCommunicationSentGroupConfigAction.error(null));
    try {
      const response = await duplicateCommunicationSentGroupConfigAPI(id);
      dispatch(
        duplicateCommunicationSentGroupConfigAction.success(response.data),
      );
      dispatch(snackbarSuccess('communicationSentGroupConfig.create.success'));

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(duplicateCommunicationSentGroupConfigAction.error(error));
      dispatch(snackbarError('communicationSentGroupConfig.duplicate.error'));

      options?.onError?.();
    }
    dispatch(duplicateCommunicationSentGroupConfigAction.isLoading(false));
  };
}

export const fetchCommunicationSentGroupConfigsListAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/RETRIEVE/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/RETRIEVE/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig[]>(
    'COMMUNICATION-SENT-GROUP-CONFIG/RETRIEVE/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupConfigsList(
  options?: OptionCallback<CommunicationSentGroupConfig[]>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCommunicationSentGroupConfigsListAction.isLoading(true));
    dispatch(fetchCommunicationSentGroupConfigsListAction.error(null));
    try {
      const response = await fetchCommunicationSentGroupConfigsListAPI();
      dispatch(
        fetchCommunicationSentGroupConfigsListAction.success(
          response.data.results,
        ),
      );

      options?.onSuccess?.(response.data.results);
    } catch (error) {
      console.error(error);
      dispatch(fetchCommunicationSentGroupConfigsListAction.error(error));
    }
    dispatch(fetchCommunicationSentGroupConfigsListAction.isLoading(false));
  };
}

export const fetchCommunicationSentGroupConfigsPaginatedListActions = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/LIST-PAGINATED/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/LIST-PAGINATED/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<CommunicationSentGroupConfig>>(
    'COMMUNICATION-SENT-GROUP-CONFIG/LIST-PAGINATED/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupConfigsPaginatedList(
  params: CommunicationSentGroupConfigQueryParams,
  options?: OptionCallback<PaginatedResponse<CommunicationSentGroupConfig>>,
): ThunkAction {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(
      fetchCommunicationSentGroupConfigsPaginatedListActions.isLoading(true),
    );
    dispatch(
      fetchCommunicationSentGroupConfigsPaginatedListActions.error(null),
    );

    const currentState =
      getState().communicationSentGroupConfig
        .communicationSentGroupConfigPaginated;

    const nextPage = params?.page ?? currentState.next_page ?? 1;
    try {
      const response = await fetchCommunicationSentGroupConfigsListAPI({
        ...params,
        page: nextPage,
        page_size: FRANCHISE_COMMUNICATION_SENT_GROUP_PAGINATION_SIZE,
      });
      dispatch(
        fetchCommunicationSentGroupConfigsPaginatedListActions.success({
          ...response.data,
          page: nextPage,
        }),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(
        fetchCommunicationSentGroupConfigsPaginatedListActions.error(error),
      );
      options?.onError?.();
    }
    dispatch(
      fetchCommunicationSentGroupConfigsPaginatedListActions.isLoading(false),
    );
  };
}
export const sendGroupedCommunicationAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/SEND-GROUPED-COMMUNICATION/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/SEND-GROUPED-COMMUNICATION/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig>(
    'COMMUNICATION-SENT-GROUP-CONFIG/SEND-GROUPED-COMMUNICATION/SUCCESS',
  ),
};

export function sendGroupedCommunication(
  data: SendGroupedCommunicationData,
  options?: OptionCallback,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(sendGroupedCommunicationAction.isLoading(true));
    dispatch(sendGroupedCommunicationAction.error(null));
    try {
      await sendGroupedCommunicationAPI(data);
      dispatch(snackbarSuccess('communication.success'));

      options?.onSuccess?.();
    } catch (error) {
      console.error(error);
      dispatch(snackbarError('communication:mail.error'));
      dispatch(sendGroupedCommunicationAction.error(error));

      options?.onError?.();
    }
    dispatch(sendGroupedCommunicationAction.isLoading(false));
  };
}

export const communicationSentGroupConfigDetailAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DETAIL/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DETAIL/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupConfig>(
    'COMMUNICATION-SENT-GROUP-CONFIG/DETAIL/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupConfigDetail(
  id: number,
  options: OptionCallback<CommunicationSentGroupConfig>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(communicationSentGroupConfigDetailAction.isLoading(true));
    dispatch(communicationSentGroupConfigDetailAction.error(null));
    try {
      const response = await fetchCommunicationSentGroupConfigDetailAPI(id);

      dispatch(communicationSentGroupConfigDetailAction.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(communicationSentGroupConfigDetailAction.error(error));

      options?.onError?.();
    }
    dispatch(communicationSentGroupConfigDetailAction.isLoading(false));
  };
}

export const fetchCommunicationSentGroupList = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY/IS_LOADING',
  ),
  success: createAction<PaginatedResponse<CommunicationSentGroup>>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupConfigCommunicationSentGroupList(
  params: FetchCommunicationSentGroupConfigCommunicationSentGroupParams,
  options: OptionCallback<PaginatedResponse<CommunicationSentGroup>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCommunicationSentGroupList.isLoading(true));
    dispatch(fetchCommunicationSentGroupList.error(null));
    try {
      const response =
        await fetchCommunicationSentGroupConfigCommunicationSentGroupListAPI(
          params,
        );
      dispatch(fetchCommunicationSentGroupList.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(fetchCommunicationSentGroupList.error(error));

      options?.onError?.();
    }
    dispatch(fetchCommunicationSentGroupList.isLoading(false));
  };
}

export const communicationSentGroupDetailsAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY-DETAIL/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY-DETAIL/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroup>(
    'COMMUNICATION-SENT-GROUP-CONFIG/HISTORY-DETAIL/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupDetails(
  id: number,
  options?: OptionCallback<CommunicationSentGroup>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(communicationSentGroupDetailsAction.isLoading(true));
    dispatch(communicationSentGroupDetailsAction.error(null));
    try {
      const response = await fetchCommunicationSentGroupDetailsAPI(id);
      dispatch(communicationSentGroupDetailsAction.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(communicationSentGroupDetailsAction.error(error));

      options?.onError?.();
    }
    dispatch(communicationSentGroupDetailsAction.isLoading(false));
  };
}

export const recipientListByCommunicationSentGroupAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/RECIPIENT/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/RECIPIENT/IS_LOADING',
  ),
  success: createAction<
    PaginatedResponse<Recipient> & {
      params: { ordering?: string };
    }
  >('COMMUNICATION-SENT-GROUP-CONFIG/RECIPIENT/SUCCESS'),
};

export function fetchRecipientListByCommunicationSentGroup(
  _params: FetchRecipientListByCommunicationSentGroupParams,
  options?: OptionCallback<PaginatedResponse<Recipient>>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(recipientListByCommunicationSentGroupAction.isLoading(true));
    dispatch(recipientListByCommunicationSentGroupAction.error(null));
    try {
      /* I have to this separation because of how the component RecipientTable works and because
       fetchRecipientByCampaign has as arguments "campaign" and "page" WHICH should be IN params like here */
      const { params, ...realParams } = _params;
      const response = await fetchRecipientListByCommunicationSentGroupAPI({
        ...realParams,
        page_size: 15,
        ...params,
      });
      dispatch(
        recipientListByCommunicationSentGroupAction.success({
          ...response.data,
          params,
        }),
      );

      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(recipientListByCommunicationSentGroupAction.error(error));

      options?.onError?.();
    }
    dispatch(recipientListByCommunicationSentGroupAction.isLoading(false));
  };
}

export const reportByCommunicationSentGroupAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/REPORT/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/REPORT/IS_LOADING',
  ),
  success: createAction<CommunicationSentGroupReport>(
    'COMMUNICATION-SENT-GROUP-CONFIG/REPORT/SUCCESS',
  ),
};

export function fetchReportByCommunicationSentGroup(
  id: number,
  options?: OptionCallback<CommunicationSentGroupReport>,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(reportByCommunicationSentGroupAction.isLoading(true));
    dispatch(reportByCommunicationSentGroupAction.error(null));
    try {
      const response = await fetchCommunicationSentGroupReportAPI(id);

      dispatch(reportByCommunicationSentGroupAction.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      console.error(error);
      dispatch(reportByCommunicationSentGroupAction.error(error));

      options?.onError?.();
    }
    dispatch(reportByCommunicationSentGroupAction.isLoading(false));
  };
}

export const fetchMembersDataTableListExportActions = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/MEMBERS_DATA_EXPORT_BACKGROUND/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/MEMBERS_DATA_EXPORT_BACKGROUND/IS_LOADING',
  ),
  success: createAction(
    'COMMUNICATION-SENT-GROUP-CONFIG/MEMBERS_DATA_EXPORT_BACKGROUND/SUCCESS',
  ),
};

export function fetchMembersDataTableListExport(
  id: number,
  options: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMembersDataTableListExportActions.isLoading(true));
    dispatch(fetchMembersDataTableListExportActions.error(null));
    try {
      const response = await fetchMembersDataTableListExportAPI(id);
      dispatch(fetchMembersDataTableListExportActions.success(response));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: (error) => {
            dispatch(fetchMembersDataTableListExportActions.error(error));
            options.onBackgroundError?.();
          },
        }),
      );
      options?.onSuccess?.();
    } catch (err) {
      dispatch(fetchMembersDataTableListExportActions.error(err));
      options?.onError?.();
      dispatch(snackbarError('communication:campaign.report.exportError'));
    }
    dispatch(fetchMembersDataTableListExportActions.isLoading(false));
  };
}

export const fetchMembersDataTableListExportLinkActions = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_MEMBERS_DATA_EXPORT_LINK/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_MEMBERS_DATA_EXPORT_BACKGROUND/LOADING',
  ),
  success: createAction(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_MEMBERS_DATA_EXPORT_LINK/SUCCESS',
  ),
};

export function fetchMembersDataTableListExportLink(
  id: number,
  options: OptionCallback<string>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMembersDataTableListExportLinkActions.isLoading(true));
    dispatch(fetchMembersDataTableListExportLinkActions.error(null));
    try {
      const response = await fetchMembersDataTableListExportLinkAPI(id);
      dispatch(
        fetchMembersDataTableListExportLinkActions.success(response.data),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchMembersDataTableListExportLinkActions.error(error));
      options?.onError?.();
    }
    dispatch(fetchMembersDataTableListExportLinkActions.isLoading(false));
  };
}

export const fetchCommunicationSentGroupRecipientListExportAction = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/CSV_EXPORT_BACKGROUND/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/CSV_EXPORT_BACKGROUND/IS_LOADING',
  ),
  success: createAction(
    'COMMUNICATION-SENT-GROUP-CONFIG/CSV_EXPORT_BACKGROUND/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupRecipientListExport(
  id: number,
  options?: OptionBackgroundCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      fetchCommunicationSentGroupRecipientListExportAction.isLoading(true),
    );
    dispatch(fetchCommunicationSentGroupRecipientListExportAction.error(null));
    try {
      const response = await fetchCommunicationSentGroupRecipientListExportAPI(
        id,
      );
      dispatch(
        fetchCommunicationSentGroupRecipientListExportAction.success(response),
      );
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: options?.onBackgroundSuccess,
          onError: (error) => {
            dispatch(
              fetchCommunicationSentGroupRecipientListExportAction.error(error),
            );
            options?.onBackgroundError?.();
          },
        }),
      );
    } catch (err) {
      dispatch(fetchCommunicationSentGroupRecipientListExportAction.error(err));
      options?.onError?.();
    }
    dispatch(
      fetchCommunicationSentGroupRecipientListExportAction.isLoading(false),
    );
  };
}

export const fetchCommunicationSentGroupRecipientListExportLinkActions = {
  error: createAction<Error | null>(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_CAMPAIGN_EXPORT_LINK/ERROR',
  ),
  isLoading: createAction<boolean>(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_CAMPAIGN_EXPORT_LINK/LOADING',
  ),
  success: createAction<string>(
    'COMMUNICATION-SENT-GROUP-CONFIG/FETCH_CAMPAIGN_EXPORT_LINK/SUCCESS',
  ),
};

export function fetchCommunicationSentGroupRecipientListExportLink(
  id: number,
  options: OptionCallback<string>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      fetchCommunicationSentGroupRecipientListExportLinkActions.isLoading(true),
    );
    dispatch(
      fetchCommunicationSentGroupRecipientListExportLinkActions.error(null),
    );
    try {
      const response =
        await fetchCommunicationSentGroupRecipientListExportLinkAPI(id);
      dispatch(
        fetchCommunicationSentGroupRecipientListExportLinkActions.success(
          response.data,
        ),
      );
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(
        fetchCommunicationSentGroupRecipientListExportLinkActions.error(error),
      );
      options?.onError?.();
    }
    dispatch(
      fetchCommunicationSentGroupRecipientListExportLinkActions.isLoading(
        false,
      ),
    );
  };
}
