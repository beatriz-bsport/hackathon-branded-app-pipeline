import Seamless from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  availabilitySlotListActions,
  availabilitySlotUpdateActions,
  availabilitySlotSearchActions,
  availabilitySlotExistsActions,
  calendarEventListActions,
  privateServiceListActions,
  privateServiceMarketplaceListActions,
  privateServiceWithSlotListActions,
  privateServiceRetrieveActions,
  privateServiceCreateOrUpdateActions,
  privateSlotListActions,
  privateSlotBulkActions,
  privateServiceBulkActions,
  privateBookingListActions,
  privateBookingAttachCoachActions,
  privateBookingCreateOrUpdateActions,
  privateBookingDeleteActions,
  privateSlotRetrieveActions,
  privateBookingRetrieveActions,
  resourceListActions,
  privateSlotCreateOrUpdateActions,
  privatePassListActions,
  privatePassAsConsumerListActions,
  privatePassCreateOrUpdateActions,
  privatePassRetrieveActions,
  privateConsumerPassListActions,
  byPrivatePass,
  byMember,
  privateConsumerPassRetrieveActions,
  privateConsumerPassUpdateCreditActions,
  updateResourceConfigurationActions,
  serviceGroupListActions,
  serviceGroupCreateOrUpdateActions,
  serviceGroupDeleteActions,
  listPrivateConsumerPassExtensionActions,
  deletePrivateConsumerPassExtensionActions,
  createPrivateConsumerPassExtensionActions,
  privateConsumerPassBulkActions,
  createOrUpdateCustomEventActions,
  listCustomEventActions,
  deleteCustomEventActions,
  privatePassBulkActions,
  listPrivateConsumerPassCompatibleActions,
  listRecurrenceRulePrivateBookingActions,
  createOrUpdateRecurrenceRulePrivateBookingActions,
  deleteRecurrenceRulePrivateBookingActions,
  privateServiceCompatiblePassActions,
} from './actions';

import { getResourceSlotsExistState } from './selectors/availability-slot';
import { PrivateServiceState } from './types';

const initialState: Seamless.Immutable<PrivateServiceState> = Seamless<PrivateServiceState>(
  {
    customEvent: {
      byId: {},
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    privateSlot: {
      byId: {},
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    privateConsumerPass: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      update: {
        loading: false,
        error: null,
      },
      compatible: {
        loading: false,
        error: null,
        allIds: [],
      },
      byPrivatePass: {
        error: null,
        loading: false,
        privatePassId: null,
        allIds: [],
        page: null,
        count: null,
      },
      byMember: {
        loading: false,
        error: null,
        allIds: [],
        page: 1,
        count: 0,
      },
      extension: {
        items: [],
        loading: false,
        error: null,
        create: {
          loading: false,
          error: null,
        },
        delete: {
          loading: false,
          error: null,
        },
        updatingConsumerPass: [],
      },
    },
    resource: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    privateService: {
      byId: {},
      allIds: [],
      marketplaceIds: [],
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    serviceGroup: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      delete: {
        loading: false,
        error: null,
      },
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    privateBooking: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    recurrenceRule: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      delete: {
        error: null,
        loading: false,
      },
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    privatePass: {
      byId: {},
      allIds: [],
      asConsumer: {
        allIds: [],
        loading: false,
        error: null,
      },
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    calendarEvent: {
      loading: false,
      error: null,
      byId: {},
    },
    availabilitySlot: {
      existsByResourceTypeById: {},
      byId: {},
      searched: {
        items: [],
        loading: false,
        error: null,
      },
      loading: false,
      error: null,
      createOrUpdate: {
        loading: false,
        error: null,
      },
    },
    compatibleServicePass: {
      byId: {},
      loading: false,
      error: null,
      allIds: [],
    },
  },
);

export default handleActions<Seamless.Immutable<PrivateServiceState>, any>(
  {
    [listCustomEventActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          customEvent: {
            byId: payload.reduce((acc: any, v: any) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [listCustomEventActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['customEvent', 'loading'], payload);
    },
    [listCustomEventActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['customEvent', 'error'], payload);
    },
    [listCustomEventActions.reset.toString().toString()]: (state) => {
      return state.setIn(['customEvent', 'byId'], {});
    },
    [createOrUpdateCustomEventActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['customEvent', 'createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateCustomEventActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['customEvent', 'byId', payload.id], payload);
    },
    [createOrUpdateCustomEventActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['customEvent', 'createOrUpdate', 'error'], payload);
    },
    [deleteCustomEventActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['customEvent', 'byId'],
        state.customEvent.byId.without(payload),
      );
    },
    [listPrivateConsumerPassExtensionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        payload,
      );
    },
    [listPrivateConsumerPassExtensionActions.reset.toString()]: (state) => {
      return state.setIn(['privateConsumerPass', 'extension', 'items'], []);
    },
    [listPrivateConsumerPassExtensionActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'error'],
        payload,
      );
    },
    [listPrivateConsumerPassExtensionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'loading'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'delete', 'loading'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'delete', 'error'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        state.privateConsumerPass.extension.items.filter(
          (e: any) => e.id !== payload,
        ),
      );
    },
    [createPrivateConsumerPassExtensionActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'create', 'loading'],
        payload,
      );
    },
    [createPrivateConsumerPassExtensionActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'create', 'error'],
        payload,
      );
    },
    [createPrivateConsumerPassExtensionActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        [...(state.privateConsumerPass.extension.items as any), payload],
      );
    },
    [updateResourceConfigurationActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['resource', 'byId', payload.resource_identifier],
        payload,
      );
    },
    [calendarEventListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['calendarEvent', 'loading'], payload);
    },
    [calendarEventListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['calendarEvent', 'error'], payload);
    },
    [calendarEventListActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          calendarEvent: {
            byId: payload.reduce((acc: any, v: any) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [availabilitySlotListActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          availabilitySlot: {
            byId: payload.reduce((acc: any, v: any) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [availabilitySlotListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['availabilitySlot', 'loading'], payload);
    },

    [availabilitySlotExistsActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          (state as unknown) as PrivateServiceState,
          payload.resourceDatatype,
          payload.resourceIdentifier,
          // @ts-ignore
        ).set('loading', payload.loading),
      );
    },
    [availabilitySlotExistsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          (state as unknown) as PrivateServiceState,
          payload.resourceDatatype,
          payload.resourceIdentifier,
          // @ts-ignore
        ).set('exists', payload.exists),
      );
    },
    [availabilitySlotExistsActions.error.toString()]: (state, { payload }) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          (state as unknown) as PrivateServiceState,
          payload.resourceDatatype,
          payload.resourceIdentifier,
          // @ts-ignore
        ).set('error', payload.error),
      );
    },
    [availabilitySlotListActions.reset.toString()]: (state) => {
      return state.setIn(['availabilitySlot', 'byId'], {});
    },
    [availabilitySlotListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'error'], payload);
    },
    [availabilitySlotSearchActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['availabilitySlot', 'searched', 'items'], payload);
    },
    [availabilitySlotSearchActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['availabilitySlot', 'searched', 'loading'], payload);
    },
    [availabilitySlotSearchActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'searched', 'error'], payload);
    },
    [availabilitySlotSearchActions.reset.toString()]: (state) => {
      return state.setIn(['availabilitySlot', 'searched', 'items'], []);
    },

    [availabilitySlotUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['availabilitySlot', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [availabilitySlotUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(
        ['availabilitySlot', 'createOrUpdate', 'error'],
        payload,
      );
    },

    [serviceGroupListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'loading'], payload);
    },
    [serviceGroupListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'error'], payload);
    },
    [serviceGroupCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['serviceGroup', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [serviceGroupCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['serviceGroup', 'createOrUpdate', 'error'], payload);
    },
    [serviceGroupCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['serviceGroup', 'byId', payload.id], payload);
    },
    [serviceGroupDeleteActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'delete', 'loading'], payload);
    },
    [serviceGroupDeleteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'delete', 'error'], payload);
    },
    [serviceGroupDeleteActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['serviceGroup', 'allIds'],
        state.serviceGroup.allIds.filter((id: any) => id !== payload),
      );
    },
    [serviceGroupListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            serviceGroup: {
              byId: payload.reduce((acc: any, v: any) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['serviceGroup', 'allIds'],
          payload.map((g: any) => g.id),
        );
    },

    [privateBookingAttachCoachActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },

    [privateBookingRetrieveActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'error'], payload);
    },
    [privateBookingRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateBooking', 'loading'], payload);
    },
    [privateBookingRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },

    [privateBookingListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'error'], payload);
    },
    [privateBookingListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'loading'], payload);
    },
    [privateBookingListActions.reset.toString()]: (state) => {
      return state.setIn(['privateBooking', 'byId'], {});
    },
    [privateBookingListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privateBooking', 'allIds'],
          payload.map((pb: any) => pb.id),
        )
        .merge(
          {
            privateBooking: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateBookingCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateBooking', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [privateBookingCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateBooking', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [privateBookingCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },
    [privateBookingDeleteActions.success.toString()]: (state, { payload }) => {
      return state
        .updateIn(['privateBooking', 'byId'], (x: any) =>
          x.without(`${payload}`),
        )
        .setIn(
          ['privateBooking', 'allIds'],
          state.privateBooking.allIds.filter((x: any) => x !== payload),
        );
    },

    [createOrUpdateRecurrenceRulePrivateBookingActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['recurrenceRule', 'byId', payload.id], payload)
        .setIn(
          ['recurrenceRule', 'allIds'],
          [...state.recurrenceRule.allIds, payload.id],
        );
    },
    [createOrUpdateRecurrenceRulePrivateBookingActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['recurrenceRule', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [createOrUpdateRecurrenceRulePrivateBookingActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['recurrenceRule', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [deleteRecurrenceRulePrivateBookingActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['recurrenceRule', 'delete', 'loading'], payload);
    },
    [deleteRecurrenceRulePrivateBookingActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['recurrenceRule', 'delete', 'error'], payload);
    },
    [listRecurrenceRulePrivateBookingActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['recurrenceRule', 'loading'], payload);
    },
    [listRecurrenceRulePrivateBookingActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['recurrenceRule', 'error'], payload);
    },
    [listRecurrenceRulePrivateBookingActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['recurrenceRule', 'allIds'],
          payload.map((pb) => pb.id),
        )
        .merge(
          {
            recurrenceRule: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },

    [resourceListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            resource: {
              byId: payload.reduce(
                (acc: any, resource: any) => ({
                  ...acc,
                  [resource.resource_identifier]: resource,
                }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['resource', 'allIds'],
          payload.map((r: any) => r.resource_identifier),
        );
    },
    [resourceListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['resource', 'loading'], payload);
    },
    [resourceListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['resource', 'error'], payload);
    },
    [privateServiceBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceBulkActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          privateService: {
            byId: payload.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateServiceWithSlotListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceWithSlotListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceMarketplaceListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['privateService', 'marketplaceIds'],
          payload.map((ps: any) => ps.id),
        )
        .setIn(
          ['privateService', 'byId'],
          payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        );
    },
    [privateServiceMarketplaceListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceMarketplaceListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privateService', 'allIds'],
          payload.map((ps: any) => ps.id),
        )
        .setIn(
          ['privateService', 'byId'],
          payload.reduce((acc: any, ps: any) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        );
    },
    [privateServiceWithSlotListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceWithSlotListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateService', 'byId', payload.id], payload);
    },
    [privateServiceCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateService', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [privateServiceCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateService', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [privateSlotBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotBulkActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          privateSlot: {
            byId: payload.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateSlotListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotListActions.all.toString()]: (state, { payload }) => {
      return state.merge(
        {
          privateSlot: {
            byId: payload.reduce((acc: any, ps: any) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateSlotListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privateSlot', 'allIds'],
          payload.map((ps: any) => ps.id),
        )
        .merge(
          {
            privateSlot: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateSlotRetrieveActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotRetrieveActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotRetrieveActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'byId', payload.id], payload);
    },
    [privateSlotCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateSlot', 'createOrUpdate', 'loading'], payload);
    },
    [privateSlotCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateSlot', 'createOrUpdate', 'error'], payload);
    },
    [privateSlotCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        { privateSlot: { byId: { [payload.id.toString()]: payload } } },
        { deep: true },
      );
    },

    [privatePassListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privatePass', 'loading'], payload);
    },
    [privatePassListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privatePass', 'error'], payload);
    },
    [privatePassListActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privatePass', 'allIds'],
          payload.map((pp: any) => pp.id),
        )
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privatePassBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privatePass', 'loading'], payload);
    },
    [privatePassBulkActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privatePass', 'error'], payload);
    },
    [privatePassBulkActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .updateIn(
          ['privatePass', 'allIds'],
          (myList: any, newId: any) => {
            return myList.concat(newId);
          },
          payload.map((pp: any) => pp.id),
        );
    },
    [privatePassAsConsumerListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privatePass', 'asConsumer', 'loading'], payload);
    },
    [privatePassAsConsumerListActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privatePass', 'asConsumer', 'error'], payload);
    },
    [privatePassAsConsumerListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['privatePass', 'asConsumer', 'allIds'],
          payload.map((pp: any) => pp.id),
        )
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privatePassCreateOrUpdateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privatePass', 'createOrUpdate', 'loading'], payload);
    },
    [privatePassCreateOrUpdateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privatePass', 'createOrUpdate', 'error'], payload);
    },
    [privatePassCreateOrUpdateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        { privatePass: { byId: { [payload.id]: payload } } },
        { deep: true },
      );
    },

    [byPrivatePass.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'byPrivatePass', 'loading'],
        payload,
      );
    },
    [byPrivatePass.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privateConsumerPass', 'byPrivatePass', 'allIds'],
          payload.results.map((cpp: any) => cpp.id),
        )
        .merge(
          {
            privateConsumerPass: {
              byId: payload.results.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(['privateConsumerPass', 'byPrivatePass', 'count'], payload.count)
        .setIn(['privateConsumerPass', 'byPrivatePass', 'page'], payload.page);
    },
    [byPrivatePass.error.toString()]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'byPrivatePass', 'error'],
        payload,
      );
    },
    [byMember.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['privateConsumerPass', 'byMember', 'allIds'],
          payload.map((pcp) => pcp.id),
        )
        .merge(
          {
            privateConsumerPass: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [byMember.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'byMember', 'loading'],
        payload,
      );
    },
    [byMember.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'byMember', 'error'], payload);
    },
    [privatePassRetrieveActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['privatePass', 'isLoading'], payload);
    },
    [privatePassRetrieveActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          privatePass: {
            byId: { [payload.id]: payload },
          },
        },
        { deep: true },
      );
    },
    [listPrivateConsumerPassCompatibleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'compatible', 'loading'],
        payload,
      );
    },
    [listPrivateConsumerPassCompatibleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'compatible', 'error'],
        payload,
      );
    },
    [listPrivateConsumerPassCompatibleActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['privateConsumerPass', 'compatible', 'allIds'],
          payload.map((pp: any) => pp.id),
        )
        .merge(
          {
            privateConsumerPass: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateConsumerPassListActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'loading'], payload);
    },
    [privateConsumerPassListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'error'], payload);
    },
    [privateConsumerPassListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['privateConsumerPass', 'allIds'],
          payload.map((pp: any) => pp.id),
        )
        .merge(
          {
            privateConsumerPass: {
              byId: payload.reduce((acc: any, ps: any) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateConsumerPassRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'loading'], payload);
    },
    [privateConsumerPassRetrieveActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'error'], payload);
    },
    [privateConsumerPassRetrieveActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'byId', payload.id], payload);
    },
    [privateConsumerPassUpdateCreditActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'update', 'loading'], payload);
    },
    [privateConsumerPassUpdateCreditActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'update', 'error'], payload);
    },
    [privateConsumerPassUpdateCreditActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'byId', payload.id], payload);
    },
    [privateConsumerPassBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'loading'], payload);
    },
    [privateConsumerPassBulkActions.error]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'error'], payload);
    },
    [privateConsumerPassBulkActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            privateConsumerPass: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .updateIn(
          ['privateConsumerPass', 'allIds'],
          (myList, newId) => {
            return myList.concat(newId);
          },
          payload.map((pcp) => pcp.id),
        );
    },
    [privateServiceCompatiblePassActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatibleServicePass', 'loading'], payload);
    },
    [privateServiceCompatiblePassActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatibleServicePass', 'error'], payload);
    },
    [privateServiceCompatiblePassActions.update.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['compatibleServicePass', 'byId', payload.id],
        payload,
      );
    },
    [privateServiceCompatiblePassActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['compatibleServicePass', 'allIds'],
          payload.map((pp: any) => pp.id),
        )
        .merge(
          {
            compatibleServicePass: {
              byId: payload.reduce((acc: any, v: any) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
