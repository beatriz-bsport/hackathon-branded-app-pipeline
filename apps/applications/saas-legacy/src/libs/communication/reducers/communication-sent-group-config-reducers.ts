import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { PaginatedResponse } from '../../../state/types';
import {
  sendGroupedCommunicationAction,
  fetchCommunicationSentGroupConfigsListAction,
  updateCommunicationSentGroupConfigAction,
  createCommunicationSentGroupConfigAction,
  deleteCommunicationSentGroupConfigAction,
  duplicateCommunicationSentGroupConfigAction,
  communicationSentGroupConfigDetailAction,
  fetchCommunicationSentGroupList,
  communicationSentGroupDetailsAction,
  recipientListByCommunicationSentGroupAction,
  reportByCommunicationSentGroupAction,
  fetchCommunicationSentGroupRecipientListExportLinkActions,
} from '../actions';
import type {
  CommunicationSentGroupReport,
  CommunicationSentGroupConfig,
  CommunicationSentGroup,
  CommunicationSentGroupConfigState,
  Recipient,
} from '../types';

type PayloadReduceType<T> = { [id: number]: T };
const initialState = Immutable<CommunicationSentGroupConfigState>({
  communicationSentGroupConfig: {
    byId: {},
    allIds: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    loading: false,
    error: false,
  },
  mail: { loading: false, error: null },
  communicationSentGroup: {
    byId: {},
    allIds: [],
    page: null,
    next_page: null,
    count: null,
    loading: false,
    error: false,
    report: { data: null, loading: false, error: null },
    export: {
      loading: false,
      error: null,
      link: null,
    },
  },
  recipient: {
    byId: {},
    allIds: [],
    params: { ordering: '' },
    page: null,
    next_page: null,
    count: null,
    loading: false,
    error: null,
  },
});

export default handleActions<
  Immutable.Immutable<CommunicationSentGroupConfigState>,
  any
>(
  {
    // sendGroupedCommunication state reducers
    [sendGroupedCommunicationAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['mail', 'loading'], payload),
    [sendGroupedCommunicationAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['mail', 'error'], payload),

    // Create and update reducers
    [createCommunicationSentGroupConfigAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupConfig },
    ) =>
      state
        .merge(
          {
            communicationSentGroupConfig: {
              byId: { [payload.id]: payload },
            },
          },
          { deep: true },
        )
        .updateIn(
          ['communicationSentGroupConfig', 'allIds'],
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        ),
    [createCommunicationSentGroupConfigAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'loading'],
        payload,
      ),
    [createCommunicationSentGroupConfigAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'error'],
        payload,
      ),

    [updateCommunicationSentGroupConfigAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupConfig },
    ) =>
      state.merge(
        { communicationSentGroupConfig: { byId: { [payload.id]: payload } } },
        { deep: true },
      ),
    [updateCommunicationSentGroupConfigAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'loading'],
        payload,
      ),
    [updateCommunicationSentGroupConfigAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'loading'],
        payload,
      ),

    // Delete reducer
    [deleteCommunicationSentGroupConfigAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationSentGroupConfig', 'loading'], payload);
    },
    [deleteCommunicationSentGroupConfigAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationSentGroupConfig', 'error'], payload);
    },
    [deleteCommunicationSentGroupConfigAction.success.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state
        .updateIn(['communicationSentGroupConfig', 'byId'], (allIds) =>
          allIds.without(payload),
        )
        .updateIn(
          ['communicationSentGroupConfig', 'allIds'],
          (myList, removeId) => {
            const newList = myList.filter((id) => id !== removeId);
            return newList;
          },
          payload,
        );
    },

    // Duplicate action reducer
    [duplicateCommunicationSentGroupConfigAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupConfig },
    ) =>
      state
        .merge(
          {
            communicationSentGroupConfig: {
              byId: { [payload.id]: payload },
            },
          },
          { deep: true },
        )
        .updateIn(
          ['communicationSentGroupConfig', 'allIds'],
          (myList, newId) => {
            return myList.concat([newId]);
          },
          payload.id,
        ),
    [duplicateCommunicationSentGroupConfigAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'loading'],
        payload,
      ),
    [duplicateCommunicationSentGroupConfigAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) =>
      state.setIn(
        ['communicationSentGroupConfig', 'createOrUpdate', 'error'],
        payload,
      ),

    // Franchise campaign fetch reducers
    [fetchCommunicationSentGroupConfigsListAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupConfig[] },
    ) =>
      state
        .setIn(
          ['communicationSentGroupConfig', 'allIds'],
          payload.map(
            (communicationSentGroupConfig: CommunicationSentGroupConfig) =>
              communicationSentGroupConfig.id,
          ),
        )
        .merge(
          {
            communicationSentGroupConfig: {
              byId: payload.reduce<
                PayloadReduceType<CommunicationSentGroupConfig>
              >((accumulator, currentValue) => {
                accumulator[currentValue.id] = currentValue;
                return accumulator;
              }, {}),
            },
          },
          { deep: true },
        ),
    [fetchCommunicationSentGroupConfigsListAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['communicationSentGroupConfig', 'error'], payload),
    [fetchCommunicationSentGroupConfigsListAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['communicationSentGroupConfig', 'loading'], payload),
    [communicationSentGroupConfigDetailAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupConfig },
    ) =>
      state
        .merge(
          {
            communicationSentGroupConfig: {
              byId: { [payload.id]: payload },
            },
          },
          { deep: true },
        )
        .updateIn(
          ['communicationSentGroupConfig', 'allIds'],
          (myList, newId) => {
            if (!myList.includes(newId)) {
              return myList.concat([newId]);
            }
            return myList;
          },
          payload.id,
        ),
    [communicationSentGroupConfigDetailAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationSentGroupConfig', 'error'], payload);
    },
    [communicationSentGroupConfigDetailAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationSentGroupConfig', 'loading'], payload);
    },

    // Franchise Campaign CommunicationSentGroup
    [fetchCommunicationSentGroupList.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<CommunicationSentGroup> },
    ) => {
      return state
        .setIn(
          ['communicationSentGroup', 'allIds'],
          payload.page > 1
            ? [
                ...state.communicationSentGroup.allIds,
                ...payload.results.map((foo) => foo.id),
              ]
            : payload.results.map((foo) => foo.id),
        )
        .setIn(['communicationSentGroup', 'page'], payload.page)
        .setIn(['communicationSentGroup', 'next_page'], payload.next_page)
        .setIn(['communicationSentGroup', 'count'], payload.count)
        .merge(
          {
            communicationSentGroup: {
              byId: payload.results.reduce<
                PayloadReduceType<CommunicationSentGroup>
              >((acc, communicationSentGroup) => {
                acc[communicationSentGroup.id] = communicationSentGroup;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [fetchCommunicationSentGroupList.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationSentGroup', 'error'], payload);
    },
    [fetchCommunicationSentGroupList.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationSentGroup', 'loading'], payload);
    },
    [communicationSentGroupDetailsAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroup },
    ) => {
      return state
        .merge(
          {
            communicationSentGroup: {
              byId: { [payload.id]: payload },
            },
          },
          { deep: true },
        )
        .updateIn(
          ['communicationSentGroup', 'allIds'],
          (myList, newId) => {
            if (!myList.includes(newId)) {
              return myList.concat([newId]);
            }
            return myList;
          },
          payload.id,
        );
    },
    [communicationSentGroupDetailsAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['communicationSentGroup', 'error'], payload);
    },
    [communicationSentGroupDetailsAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['communicationSentGroup', 'loading'], payload);
    },

    // Recipient reducers
    [recipientListByCommunicationSentGroupAction.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<Recipient> & {
          params: { ordering?: string };
        };
      },
    ) => {
      return state
        .setIn(
          ['recipient', 'allIds'],
          payload.results.map((recipient) => recipient.id),
        )
        .setIn(['recipient', 'page'], payload.page)
        .setIn(['recipient', 'next_page'], payload.next_page)
        .setIn(['recipient', 'params'], payload.params)
        .setIn(['recipient', 'count'], payload.count)
        .merge(
          {
            recipient: {
              byId: payload.results.reduce<PayloadReduceType<Recipient>>(
                (acc, recipient) => {
                  acc[recipient.id] = recipient;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [recipientListByCommunicationSentGroupAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['recipient', 'error'], payload);
    },
    [recipientListByCommunicationSentGroupAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['recipient', 'loading'], payload);
    },
    [reportByCommunicationSentGroupAction.success.toString()]: (
      state,
      { payload }: { payload: CommunicationSentGroupReport },
    ) => {
      return state.setIn(['communicationSentGroup', 'report', 'data'], payload);
    },
    [reportByCommunicationSentGroupAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['communicationSentGroup', 'report', 'error'],
        payload,
      );
    },
    [reportByCommunicationSentGroupAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['communicationSentGroup', 'report', 'loading'],
        payload,
      );
    },
    [fetchCommunicationSentGroupRecipientListExportLinkActions.isLoading.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.setIn(
          ['communicationSentGroup', 'export', 'loading'],
          payload,
        );
      },
    [fetchCommunicationSentGroupRecipientListExportLinkActions.error.toString()]:
      (state, { payload }: { payload: Error | null }) => {
        return state.setIn(
          ['communicationSentGroup', 'export', 'error'],
          payload,
        );
      },
    [fetchCommunicationSentGroupRecipientListExportLinkActions.success.toString()]:
      (state, { payload }: { payload: string }) => {
        return state.setIn(
          ['communicationSentGroup', 'export', 'link'],
          payload,
        );
      },
  },
  initialState,
);
