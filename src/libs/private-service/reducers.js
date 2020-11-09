// @flow

import Immutable from 'seamless-immutable';
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
  privateConsumerPassRetrieveActions,
  privateConsumerPassUpdateCreditActions,
  updateResourceConfigurationActions,
  serviceGroupListActions,
  serviceGroupCreateOrUpdateActions,
  serviceGroupDeleteActions,
  listPrivateConsumerPassExtensionActions,
  deletePrivateConsumerPassExtensionActions,
  createPrivateConsumerPassExtensionActions,
  createOrUpdateCustomEventActions,
  listCustomEventActions,
  deleteCustomEventActions,
  privatePassBulkActions,
  listPrivateConsumerPassCompatibleActions,
} from './actions';

import { getResourceSlotsExistState } from './selectors/availability-slot';
import type { PrivateServiceState } from './types';

const initialState: PrivateServiceState = Immutable({
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
});

export default handleActions(
  {
    [listCustomEventActions.success]: (state, { payload }) => {
      return state.merge(
        {
          customEvent: {
            byId: payload.reduce((acc, v) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [listCustomEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['customEvent', 'loading'], payload);
    },
    [listCustomEventActions.error]: (state, { payload }) => {
      return state.setIn(['customEvent', 'error'], payload);
    },
    [listCustomEventActions.reset]: (state) => {
      return state.setIn(['customEvent', 'byId'], {});
    },
    [createOrUpdateCustomEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['customEvent', 'createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateCustomEventActions.success]: (state, { payload }) => {
      return state.setIn(['customEvent', 'byId', payload.id], payload);
    },
    [createOrUpdateCustomEventActions.error]: (state, { payload }) => {
      return state.setIn(['customEvent', 'createOrUpdate', 'error'], payload);
    },
    [deleteCustomEventActions.success]: (state, { payload }) => {
      return state.setIn(
        ['customEvent', 'byId'],
        state.customEvent.byId.without(payload),
      );
    },
    [listPrivateConsumerPassExtensionActions.success]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        payload,
      );
    },
    [listPrivateConsumerPassExtensionActions.reset]: (state) => {
      return state.setIn(['privateConsumerPass', 'extension', 'items'], []);
    },
    [listPrivateConsumerPassExtensionActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'error'],
        payload,
      );
    },
    [listPrivateConsumerPassExtensionActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'loading'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'delete', 'loading'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'delete', 'error'],
        payload,
      );
    },
    [deletePrivateConsumerPassExtensionActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        state.privateConsumerPass.extension.items.filter(
          (e) => e.id !== payload,
        ),
      );
    },
    [createPrivateConsumerPassExtensionActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'create', 'loading'],
        payload,
      );
    },
    [createPrivateConsumerPassExtensionActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'create', 'error'],
        payload,
      );
    },
    [createPrivateConsumerPassExtensionActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'extension', 'items'],
        [...state.privateConsumerPass.extension.items, payload],
      );
    },
    [updateResourceConfigurationActions.success]: (state, { payload }) => {
      return state.setIn(
        ['resource', 'byId', payload.resource_identifier],
        payload,
      );
    },
    [calendarEventListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['calendarEvent', 'loading'], payload);
    },
    [calendarEventListActions.error]: (state, { payload }) => {
      return state.setIn(['calendarEvent', 'error'], payload);
    },
    [calendarEventListActions.success]: (state, { payload }) => {
      return state.merge(
        {
          calendarEvent: {
            byId: payload.reduce((acc, v) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [availabilitySlotListActions.success]: (state, { payload }) => {
      return state.merge(
        {
          availabilitySlot: {
            byId: payload.reduce((acc, v) => {
              acc[v.id] = v;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [availabilitySlotListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'loading'], payload);
    },
    [availabilitySlotExistsActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          state,
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ).set('loading', payload.loading),
      );
    },
    [availabilitySlotExistsActions.success]: (state, { payload }) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          state,
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ).set('exists', payload.exists),
      );
    },
    [availabilitySlotExistsActions.error]: (state, { payload }) => {
      return state.setIn(
        [
          'availabilitySlot',
          'existsByResourceTypeById',
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ],
        getResourceSlotsExistState(
          state,
          payload.resourceDatatype,
          payload.resourceIdentifier,
        ).set('error', payload.error),
      );
    },
    [availabilitySlotListActions.reset]: (state) => {
      return state.setIn(['availabilitySlot', 'byId'], {});
    },
    [availabilitySlotListActions.error]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'error'], payload);
    },
    [availabilitySlotSearchActions.success]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'searched', 'items'], payload);
    },
    [availabilitySlotSearchActions.isLoading]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'searched', 'loading'], payload);
    },
    [availabilitySlotSearchActions.error]: (state, { payload }) => {
      return state.setIn(['availabilitySlot', 'searched', 'error'], payload);
    },

    [availabilitySlotUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['availabilitySlot', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [availabilitySlotUpdateActions.error]: (state, { payload }) => {
      return state.setIn(
        ['availabilitySlot', 'createOrUpdate', 'error'],
        payload,
      );
    },

    [serviceGroupListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'loading'], payload);
    },
    [serviceGroupListActions.error]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'error'], payload);
    },
    [serviceGroupCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['serviceGroup', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [serviceGroupCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'createOrUpdate', 'error'], payload);
    },
    [serviceGroupCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'byId', payload.id], payload);
    },
    [serviceGroupDeleteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'delete', 'loading'], payload);
    },
    [serviceGroupDeleteActions.error]: (state, { payload }) => {
      return state.setIn(['serviceGroup', 'delete', 'error'], payload);
    },
    [serviceGroupDeleteActions.success]: (state, { payload }) => {
      return state.setIn(
        ['serviceGroup', 'allIds'],
        state.serviceGroup.allIds.filter((id) => id !== payload),
      );
    },
    [serviceGroupListActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            serviceGroup: {
              byId: payload.reduce((acc, v) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(['serviceGroup', 'allIds'], payload.map((g) => g.id));
    },

    [privateBookingAttachCoachActions.success]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },

    [privateBookingRetrieveActions.error]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'error'], payload);
    },
    [privateBookingRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'loading'], payload);
    },
    [privateBookingRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },

    [privateBookingListActions.error]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'error'], payload);
    },
    [privateBookingListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'loading'], payload);
    },
    [privateBookingListActions.reset]: (state) => {
      return state.setIn(['privateBooking', 'byId'], {});
    },
    [privateBookingListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privateBooking', 'allIds'], payload.map((pb) => pb.id))
        .merge(
          {
            privateBooking: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateBookingCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['privateBooking', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [privateBookingCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateBooking', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [privateBookingCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'byId', payload.id], payload);
    },
    [privateBookingDeleteActions.success]: (state, { payload }) => {
      return state
        .updateIn(['privateBooking', 'byId'], (x) => x.without(`${payload}`))
        .setIn(
          ['privateBooking', 'allIds'],
          state.privateBooking.allIds.filter((x) => x !== payload),
        );
    },

    [resourceListActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            resource: {
              byId: payload.reduce(
                (acc, resource) => ({
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
          payload.map((r) => r.resource_identifier),
        );
    },
    [resourceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['resource', 'loading'], payload);
    },
    [resourceListActions.error]: (state, { payload }) => {
      return state.setIn(['resource', 'error'], payload);
    },
    [privateServiceBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceBulkActions.error]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          privateService: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateServiceWithSlotListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceWithSlotListActions.error]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceMarketplaceListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privateService', 'marketplaceIds'], payload.map((ps) => ps.id))
        .setIn(
          ['privateService', 'byId'],
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        );
    },
    [privateServiceMarketplaceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceMarketplaceListActions.error]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privateService', 'allIds'], payload.map((ps) => ps.id))
        .setIn(
          ['privateService', 'byId'],
          payload.reduce((acc, ps) => {
            acc[ps.id] = ps;
            return acc;
          }, {}),
        );
    },
    [privateServiceWithSlotListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceWithSlotListActions.error]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateService', 'loading'], payload);
    },
    [privateServiceListActions.error]: (state, { payload }) => {
      return state.setIn(['privateService', 'error'], payload);
    },
    [privateServiceRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['privateService', 'byId', payload.id], payload);
    },
    [privateServiceCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['privateService', 'createOrUpdate', 'loading'],
        payload,
      );
    },
    [privateServiceCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateService', 'createOrUpdate', 'error'],
        payload,
      );
    },
    [privateSlotBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotBulkActions.error]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotBulkActions.success]: (state, { payload }) => {
      return state.merge(
        {
          privateSlot: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateSlotListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotListActions.error]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotListActions.all]: (state, { payload }) => {
      return state.merge(
        {
          privateSlot: {
            byId: payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
        },
        { deep: true },
      );
    },
    [privateSlotListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privateSlot', 'allIds'], payload.map((ps) => ps.id))
        .merge(
          {
            privateSlot: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privateSlotRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'loading'], payload);
    },
    [privateSlotRetrieveActions.error]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'error'], payload);
    },
    [privateSlotRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'byId', payload.id], payload);
    },
    [privateSlotCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'createOrUpdate', 'loading'], payload);
    },
    [privateSlotCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['privateSlot', 'createOrUpdate', 'error'], payload);
    },
    [privateSlotCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.merge(
        { privateSlot: { byId: { [payload.id]: payload } } },
        { deep: true },
      );
    },

    [privatePassListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privatePass', 'loading'], payload);
    },
    [privatePassListActions.error]: (state, { payload }) => {
      return state.setIn(['privatePass', 'error'], payload);
    },
    [privatePassListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privatePass', 'allIds'], payload.map((pp) => pp.id))
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privatePassBulkActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privatePass', 'loading'], payload);
    },
    [privatePassBulkActions.error]: (state, { payload }) => {
      return state.setIn(['privatePass', 'error'], payload);
    },
    [privatePassBulkActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .updateIn(
          ['privatePass', 'allIds'],
          (myList, newId) => {
            return myList.concat(newId);
          },
          payload.map((pp) => pp.id),
        );
    },
    [privatePassAsConsumerListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privatePass', 'asConsumer', 'loading'], payload);
    },
    [privatePassAsConsumerListActions.error]: (state, { payload }) => {
      return state.setIn(['privatePass', 'asConsumer', 'error'], payload);
    },
    [privatePassAsConsumerListActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['privatePass', 'asConsumer', 'allIds'],
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            privatePass: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [privatePassCreateOrUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privatePass', 'createOrUpdate', 'loading'], payload);
    },
    [privatePassCreateOrUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['privatePass', 'createOrUpdate', 'error'], payload);
    },
    [privatePassCreateOrUpdateActions.success]: (state, { payload }) => {
      return state.merge(
        { privatePass: { byId: { [payload.id]: payload } } },
        { deep: true },
      );
    },

    [byPrivatePass.isLoading]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'byPrivatePass', 'loading'],
        payload,
      );
    },
    [byPrivatePass.success]: (state, { payload }) => {
      return state
        .setIn(
          ['privateConsumerPass', 'byPrivatePass', 'allIds'],
          payload.results.map((cpp) => cpp.id),
        )
        .merge(
          {
            privateConsumerPass: {
              byId: payload.results.reduce((acc, ps) => {
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
    [byPrivatePass.error]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'byPrivatePass', 'error'],
        payload,
      );
    },
    [privatePassRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privatePass', 'isLoading'], payload);
    },
    [privatePassRetrieveActions.success]: (state, { payload }) => {
      return state.merge(
        {
          privatePass: {
            byId: { [payload.id]: payload },
          },
        },
        { deep: true },
      );
    },
    [listPrivateConsumerPassCompatibleActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateConsumerPass', 'compatible', 'loading'],
        payload,
      );
    },
    [listPrivateConsumerPassCompatibleActions.error]: (state, { payload }) => {
      return state.setIn(
        ['privateConsumerPass', 'compatible', 'error'],
        payload,
      );
    },
    [listPrivateConsumerPassCompatibleActions.success]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['privateConsumerPass', 'compatible', 'allIds'],
          payload.map((pp) => pp.id),
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
    [privateConsumerPassListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'loading'], payload);
    },
    [privateConsumerPassListActions.error]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'error'], payload);
    },
    [privateConsumerPassListActions.success]: (state, { payload }) => {
      return state
        .setIn(['privateConsumerPass', 'allIds'], payload.map((pp) => pp.id))
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
    [privateConsumerPassRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'loading'], payload);
    },
    [privateConsumerPassRetrieveActions.error]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'error'], payload);
    },
    [privateConsumerPassRetrieveActions.success]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'byId', payload.id], payload);
    },
    [privateConsumerPassUpdateCreditActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['privateConsumerPass', 'update', 'loading'], payload);
    },
    [privateConsumerPassUpdateCreditActions.error]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'update', 'error'], payload);
    },
    [privateConsumerPassUpdateCreditActions.success]: (state, { payload }) => {
      return state.setIn(['privateConsumerPass', 'byId', payload.id], payload);
    },
  },
  initialState,
);
