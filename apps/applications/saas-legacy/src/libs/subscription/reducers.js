// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  detailActions,
  contractListActions,
  contractDetailActions,
  contractRestoreActions,
  subscriptionForBookingActions,
  contractCreateOrUpdateActions,
  contractMarketplaceListActions,
  stopActions,
  listSubscriptionActions,
  byMemberSubscriptionActions,
  updateSubscriptionActions,
  freezeSubscriptionActions,
  switchPaymentPackActions,
  switchPrivatePassActions,
  switchPaymentComboActions,
  switchPaymentMethodActions,
  subscriptionBulkActions,
  listPlannedInvoiceActions,
  listContractPauseActions,
  addContractPauseActions,
  deleteContractPauseActions,
  retrieveContractPauseActions,
  updatePlannedInvoiceActions,
  downloadPDFContractTermsActions,
  fetchActiveContractTemplateListActions,
  fetchDisabledContractTemplateListActions,
  deleteContractTemplateActions,
  restoreContractTemplateActions,
  fetchContractTemplateDetailActions,
  fetchContractTemplateRelatedBillingPlansActions,
  createOrUpdateContractTemplateActions,
  storeContractTemplateDetailAction,
} from './actions';

import type {
  ContractTemplate,
  SubscriptionState,
  SubscriptionREST,
} from './types';
import { PaginatedResponse } from '#src/state/types';
import { CONTRACT_TEMPLATE_PAGE_SIZE } from './constants';

const initialState: SubscriptionState = Immutable({
  byId: {},
  createOrUpdate: {
    loading: false,
    error: null,
  },
  bulk: {
    loading: false,
    error: null,
  },
  list: {
    loading: false,
    error: null,
    allIds: [],
  },
  byMember: {
    loading: false,
    error: null,
    allIds: [],
  },
  detail: {
    loading: false,
    error: null,
  },
  stop: {
    loading: false,
    error: null,
  },
  freeze: {
    loading: false,
    error: null,
  },
  switchSubscriptionItem: {
    loading: false,
    error: null,
  },
  switchPaymentMethod: {
    loading: false,
    error: null,
  },
  events: {
    items: [],
    loading: false,
    error: null,
    page: 1,
  },
  plannedInvoice: {
    byId: {},
    loading: false,
    error: null,
    allIds: [],
    nextPage: 1,
    page: 1,
    createOrUpdate: {
      loading: false,
    },
  },

  contractPause: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    nextPage: 1,
    page: 0,
  },

  contract: {
    loading: false,
    error: null,
    byId: {},
    allIds: [],
    createOrUpdate: {
      loading: false,
      error: null,
    },
    byMarketplace: {
      loading: false,
      error: null,
      allIds: [],
    },
    forBooking: {
      loading: false,
      error: null,
      allIds: [],
    },
  },

  contractTermsDownload: {
    loading: false,
    error: null,
  },

  contractTemplate: {
    delete: {
      loading: false,
      error: null,
    },
    restore: {
      loading: false,
      error: null,
    },
    detail: {
      loading: false,
      error: null,
    },
    active: {
      loading: false,
      error: null,
      allIds: [],
      byId: {},
      count: 0,
      page: 1,
      numberOfPages: 0,
    },
    disabled: {
      loading: false,
      error: null,
      allIds: [],
      byId: {},
      count: 0,
      page: 1,
      numberOfPages: 0,
    },
    billingPlans: {
      loading: false,
      error: null,
      allIds: [],
      byId: {},
      count: 0,
      page: 1,
      nextPage: null,
    },
  },
});

export default handleActions<Immutable.Immutable<SubscriptionState>>(
  {
    [listPlannedInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['plannedInvoice', 'loading'], payload);
    },
    [updatePlannedInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['plannedInvoice', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [listPlannedInvoiceActions.error]: (state, { payload }) => {
      return state.setIn(['plannedInvoice', 'error'], payload);
    },
    [listPlannedInvoiceActions.reset]: (state) => {
      return state
        .setIn(['plannedInvoice', 'nextPage'], 1)
        .setIn(['plannedInvoice', 'allIds'], []);
    },
    [listPlannedInvoiceActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            plannedInvoice: {
              byId: payload.results.reduce(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          {
            deep: true,
          },
        )
        .setIn(
          ['plannedInvoice', 'allIds'],
          payload.results.map((pl) => pl.id),
        )
        .setIn(['plannedInvoice', 'nextPage'], payload.next_page)
        .setIn(['plannedInvoice', 'page'], payload.page)
        .setIn(['plannedInvoice', 'count'], payload.count);
    },
    [retrieveContractPauseActions.success]: (state, { payload }) => {
      return state.setIn(['contractPause', 'byId', payload.id], payload);
    },
    [deleteContractPauseActions.success]: (state, { payload }) => {
      return state.setIn(
        ['contractPause', 'allIds'],
        [...state.contractPause.allIds].filter((id: number) => id !== payload),
      );
    },
    [addContractPauseActions.success]: (state, { payload }) => {
      return state
        .setIn(['contractPause', 'byId', payload.id], payload)
        .setIn(
          ['contractPause', 'allIds'],
          [payload.id, ...state.contractPause.allIds],
        );
    },
    [listContractPauseActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contractPause', 'loading'], payload);
    },
    [listContractPauseActions.error]: (state, { payload }) => {
      return state.setIn(['contractPause', 'error'], payload);
    },
    [listContractPauseActions.reset]: (state) => {
      return state
        .setIn(['contractPause', 'nextPage'], 1)
        .setIn(['contractPause', 'allIds'], []);
    },
    [listContractPauseActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            contractPause: {
              byId: payload.results.reduce(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          {
            deep: true,
          },
        )
        .setIn(
          ['contractPause', 'allIds'],
          payload.results.map((cp) => cp.id),
        )
        .setIn(['contractPause', 'nextPage'], payload.next_page)
        .setIn(['contractPause', 'page'], payload.page)
        .setIn(['contractPause', 'count'], payload.count);
    },
    [subscriptionBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bulk', 'loading'], payload);
    },
    [subscriptionBulkActions.error]: (state, { payload }) => {
      return state.setIn(['bulk', 'error'], payload);
    },
    [subscriptionBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        },
        {
          deep: true,
        },
      );
    },
    [subscriptionForBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'forBooking', 'loading'], payload);
    },
    [subscriptionForBookingActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'forBooking', 'error'], payload);
    },
    [subscriptionForBookingActions.reset]: (state) => {
      return state.setIn(['contract', 'forBooking', 'allIds'], []);
    },
    [subscriptionForBookingActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['contract', 'forBooking', 'allIds'],
          payload.map((c) => c.id),
        );
    },
    [switchPaymentMethodActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchPaymentMethod', 'loading'], payload);
    },
    [switchPaymentMethodActions.error]: (state, { payload }) => {
      return state.setIn(['switchPaymentMethod', 'error'], payload);
    },
    [switchPaymentMethodActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [switchPaymentPackActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'loading'], payload);
    },
    [switchPaymentPackActions.error]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'error'], payload);
    },
    [switchPaymentPackActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [switchPrivatePassActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'loading'], payload);
    },
    [switchPrivatePassActions.error]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'error'], payload);
    },
    [switchPrivatePassActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [switchPaymentComboActions.isLoading]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'loading'], payload);
    },
    [switchPaymentComboActions.error]: (state, { payload }) => {
      return state.setIn(['switchSubscriptionItem', 'error'], payload);
    },
    [switchPaymentComboActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [freezeSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['freeze', 'loading'], payload);
    },
    [freezeSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['freeze', 'error'], payload);
    },
    [freezeSubscriptionActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [updateSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [updateSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [updateSubscriptionActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [listSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [listSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['list', 'error'], payload);
    },
    [listSubscriptionActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['list', 'allIds'],
          payload.results.map((c) => c.id),
        )
        .setIn(['list', 'count'], payload.count)
        .merge(
          {
            byId: payload.results.reduce(
              (acc, v) => ({ ...acc, [v.id]: v }),
              {},
            ),
          },
          { deep: true },
        );
    },
    [byMemberSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [byMemberSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['list', 'error'], payload);
    },
    [byMemberSubscriptionActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['byMember', 'allIds'],
          payload.results.map((c) => c.id),
        )
        .setIn(['byMember', 'count'], payload.count)
        .merge(
          {
            byId: payload.results.reduce(
              (acc, v) => ({ ...acc, [v.id]: v }),
              {},
            ),
          },
          { deep: true },
        );
    },

    [contractListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'loading'], payload);
    },
    [contractListActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'error'], payload);
    },
    [contractListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['contract', 'allIds'],
          payload.map((c) => c.id),
        )
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [contractDetailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'loading'], payload);
    },
    [contractDetailActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'error'], payload);
    },
    [contractDetailActions.success]: (state, { payload }) => {
      return state.merge({ contract: { byId: payload } }, { deep: true });
    },
    [contractRestoreActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'loading'], payload);
    },
    [contractCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'createOrUpdate', 'loading'], payload);
    },
    [contractCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'createOrUpdate', 'error'], payload);
    },
    [contractCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['contract', 'byId', payload.id], payload);
    },
    [contractMarketplaceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contract', 'byMarketplace', 'loading'], payload);
    },
    [contractMarketplaceListActions.error]: (state, { payload }) => {
      return state.setIn(['contract', 'byMarketplace', 'error'], payload);
    },
    [contractMarketplaceListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['contract', 'byMarketplace', 'allIds'],
          payload.map((c) => c.id),
        )
        .merge(
          {
            contract: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [detailActions.error]: (state, { payload }) => {
      return state.setIn(['detail', 'error'], payload);
    },
    [detailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['detail', 'loading'], payload);
    },
    [detailActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [stopActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stop', 'loading'], payload);
    },
    [stopActions.error]: (state, { payload }) => {
      return state.setIn(['stop', 'error'], payload);
    },
    [stopActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [downloadPDFContractTermsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['contractTermsDownload', 'loading'], payload);
    },
    [downloadPDFContractTermsActions.error]: (state, { payload }) => {
      return state.setIn(['contractTermsDownload', 'error'], payload);
    },
    [fetchActiveContractTemplateListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['contractTemplate', 'active', 'loading'], payload);
    },
    [fetchActiveContractTemplateListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['contractTemplate', 'active', 'error'], payload);
    },
    [fetchActiveContractTemplateListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ContractTemplate> },
    ) => {
      const { results, page, count } = payload;

      const numberOfPages = Math.ceil(count / CONTRACT_TEMPLATE_PAGE_SIZE);

      return state
        .setIn(['contractTemplate', 'active', 'page'], page)
        .setIn(['contractTemplate', 'active', 'count'], count)
        .setIn(['contractTemplate', 'active', 'numberOfPages'], numberOfPages)
        .setIn(
          ['contractTemplate', 'active', 'allIds'],
          results.map(
            (contractTemplate: ContractTemplate) => contractTemplate.id,
          ),
        )
        .merge(
          {
            contractTemplate: {
              active: {
                byId: results.reduce(
                  (
                    acc: Record<number, ContractTemplate>,
                    contractTemplate: ContractTemplate,
                  ) => {
                    acc[contractTemplate.id] = contractTemplate;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [fetchDisabledContractTemplateListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['contractTemplate', 'disabled', 'loading'], payload);
    },
    [fetchDisabledContractTemplateListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['contractTemplate', 'disabled', 'error'], payload);
    },
    [fetchDisabledContractTemplateListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<ContractTemplate> },
    ) => {
      const { results, page, count } = payload;

      const numberOfPages = Math.ceil(count / CONTRACT_TEMPLATE_PAGE_SIZE);

      return state
        .setIn(['contractTemplate', 'disabled', 'page'], page)
        .setIn(['contractTemplate', 'disabled', 'count'], count)
        .setIn(['contractTemplate', 'disabled', 'numberOfPages'], numberOfPages)
        .setIn(
          ['contractTemplate', 'disabled', 'allIds'],
          results.map(
            (contractTemplate: ContractTemplate) => contractTemplate.id,
          ),
        )
        .merge(
          {
            contractTemplate: {
              disabled: {
                byId: results.reduce(
                  (
                    acc: Record<number, ContractTemplate>,
                    contractTemplate: ContractTemplate,
                  ) => {
                    acc[contractTemplate.id] = contractTemplate;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [deleteContractTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['contractTemplate', 'delete', 'loading'], payload);
    },
    [deleteContractTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['contractTemplate', 'delete', 'error'], payload);
    },
    [restoreContractTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['contractTemplate', 'restore', 'loading'], payload);
    },
    [restoreContractTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['contractTemplate', 'restore', 'error'], payload);
    },
    [fetchContractTemplateDetailActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['contractTemplate', 'detail', 'loading'], payload);
    },
    [fetchContractTemplateDetailActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['contractTemplate', 'detail', 'error'], payload);
    },
    [fetchContractTemplateRelatedBillingPlansActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['contractTemplate', 'billingPlans', 'error'],
        payload,
      );
    },
    [fetchContractTemplateRelatedBillingPlansActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['contractTemplate', 'billingPlans', 'loading'],
        payload,
      );
    },
    [fetchContractTemplateRelatedBillingPlansActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<SubscriptionREST> },
    ) => {
      const { results, page, count, next_page } = payload;
      return state
        .setIn(['contractTemplate', 'billingPlans', 'page'], page)
        .setIn(['contractTemplate', 'billingPlans', 'count'], count)
        .setIn(['contractTemplate', 'billingPlans', 'nextPage'], next_page)
        .setIn(
          ['contractTemplate', 'billingPlans', 'allIds'],
          results.map(
            (contractTemplateSubscriptions: SubscriptionREST[]) =>
              contractTemplateSubscriptions.id,
          ),
        )
        .merge(
          {
            contractTemplate: {
              billingPlans: {
                byId: results.reduce(
                  (
                    acc: Record<number, ContractTemplateSubscriptions>,
                    contractTemplateSubscriptions: ContractTemplateSubscriptions,
                  ) => {
                    acc[contractTemplateSubscriptions.id] =
                      contractTemplateSubscriptions;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [createOrUpdateContractTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['contractTemplate', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [createOrUpdateContractTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['contractTemplate', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [storeContractTemplateDetailAction.toString()]: (
      state,
      { payload }: { payload: ContractTemplate },
    ) => {
      return state.merge(
        { contractTemplate: { active: { byId: { [payload.id]: payload } } } },
        { deep: true },
      );
    },
  },
  initialState,
);
