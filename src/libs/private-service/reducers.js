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
  privateBookingPreviewActions,
  privateBookingListActions,
  privateBookingCreateOrUpdateActions,
  privateBookingDeleteActions,
  privateSlotRetrieveActions,
  privateServiceResourceRetrieveActions,
  privateSlotCreateOrUpdateActions,
  privatePassListActions,
  privatePassAsConsumerListActions,
  privatePassCreateOrUpdateActions,
  privatePassRetrieveActions,
  privateConsumerPassListActions,
  privateConsumerPassRetrieveActions,
  privateConsumerPassUpdateCreditActions,
  updateResourceConfigurationActions,
  serviceGroupListActions,
  serviceGroupCreateOrUpdateActions,
  serviceGroupDeleteActions,
} from './actions';

import { getResourceSlotsExistState } from './selectors/availability-slot';
import type { PrivateServiceState } from './types';

const initialState: PrivateServiceState = Immutable({
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
  },
  privateServiceResource: {
    byId: {},
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
    preview: {
      data: null,
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
    [updateResourceConfigurationActions.success]: (state, { payload }) => {
      return state.setIn(
        ['privateServiceResource', 'byId', payload.resource_identifier],
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

    [privateBookingPreviewActions.error]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'preview', 'error'], payload);
    },
    [privateBookingPreviewActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'preview', 'loading'], payload);
    },
    [privateBookingPreviewActions.success]: (state, { payload }) => {
      return state.setIn(['privateBooking', 'preview', 'data'], payload);
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

    [privateServiceResourceRetrieveActions.success]: (state, { payload }) => {
      return state.merge(
        {
          privateServiceResource: {
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
      );
    },
    [privateServiceResourceRetrieveActions.isLoading]: (state, { payload }) => {
      return state.setIn(['privateServiceResource', 'loading'], payload);
    },
    [privateServiceResourceRetrieveActions.error]: (state, { payload }) => {
      return state.setIn(['privateServiceResource', 'error'], payload);
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
