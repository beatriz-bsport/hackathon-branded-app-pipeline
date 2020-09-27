// @flow

import moment from 'moment-timezone';
import memoize from 'memoize-one';
import pickBy from 'lodash/pickBy';
import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import type { State } from '../../../state/types';

import type { AvailabilitySlot, PrivateServiceState } from '../types';

export const DEFAULT_EXIST_CHECK: {
  loading: boolean,
  error: ?Error,
  exists: boolean,
} = Immutable({
  loading: true,
  error: null,
  exists: false,
});
export const groupByResourceDatatype = (stuff) =>
  Object.entries(groupBy(stuff, 'datatype')).reduce(
    (acc, [datatype, data]) => [...acc, { datatype, data }],
    [],
  );

const _getAvailabilitySlotsData = (state) =>
  state.privateService.availabilitySlot.byId;

type PeriodFilter = {
  start: string,
  end: string,
};

export const getResourceSlotsExistState = (
  privateServiceState: PrivateServiceState,
  resourceDatatype: string,
  resourceIdentifier: number,
) => {
  if (
    privateServiceState.availabilitySlot.existsByResourceTypeById[
      resourceDatatype
    ] &&
    privateServiceState.availabilitySlot.existsByResourceTypeById[
      resourceDatatype
    ][resourceIdentifier]
  ) {
    return privateServiceState.availabilitySlot.existsByResourceTypeById[
      resourceDatatype
    ][resourceIdentifier];
  }
  return DEFAULT_EXIST_CHECK;
};

const periodFilterExtractor = (state, periodFilter) => periodFilter;

export const getAvailabilitySlots = createSelector(
  [_getAvailabilitySlotsData, periodFilterExtractor],
  (slotsData, periodFilter) => {
    if (periodFilter) {
      return Object.values(slotsData).filter(
        (v) =>
          moment(v.date_start).isSameOrAfter(periodFilter.start) &&
          moment(v.date_start).isSameOrBefore(periodFilter.end),
      );
    }
    return Object.values(slotsData);
  },
);

export const getCoachAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, coach, periodFilter) => {
  if (coach) {
    return getAvailabilitySlots(state, periodFilter).filter(
      (s) => s.coach === coach,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getPrivateServiceResourceData = (state, serviceId) => {
  const stuff = pickBy(
    state.privateService.resource.byId,
    (resource) => `${resource.private_service}` === `${serviceId}`,
  );
  return groupByResourceDatatype(stuff);
};

const _getResourceData = (state) => state.privateService.resource.byId;
const _getResourceIds = (state) => state.privateService.resource.allIds;

export const getResourceDataList = createSelector(
  [_getResourceData, _getResourceIds],
  (data, ids) => groupByResourceDatatype(ids.map((id) => data[id])),
);

export const withResourceColor = memoize((selector) =>
  createSelector(
    [selector, _getResourceData],
    (slots, resourceData) =>
      slots.map((s) => {
        const resource = resourceData[s.resource_identifier];
        return { ...s, color: resource ? resource.color : '' };
      }),
  ),
);

export const getEstablishmentAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, establishment, periodFilter) => {
  if (establishment) {
    return getAvailabilitySlots(state, periodFilter).filter(
      (s) => s.establishment === establishment,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getPrivateServiceAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, privateServiceId, periodFilter) => {
  if (privateServiceId) {
    return getAvailabilitySlots(state, periodFilter).filter(
      (s) => s.private_service === privateServiceId,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getFilteredAvailabilitySlots = createSelector(
  [
    getAvailabilitySlots,
    (state, periodFilter, resourceIdentifierList) => resourceIdentifierList,
  ],
  (slotsData, resourceIdentifierList) => {
    if (resourceIdentifierList) {
      return slotsData.filter((slot) =>
        resourceIdentifierList.includes(slot.resource_identifier),
      );
    }
    return slotsData;
  },
);

const _getCalendarEventData = (state) =>
  state.privateService.calendarEvent.byId;

export const getFilteredCalendarEvents = createSelector(
  [_getCalendarEventData, periodFilterExtractor],
  (eventData, periodFilter) => {
    if (periodFilter) {
      return Object.values(eventData).filter(
        (v) =>
          moment(v.date_start).isSameOrAfter(periodFilter.start) &&
          moment(v.date_start).isSameOrBefore(periodFilter.end),
      );
    }
    return Object.values(eventData);
  },
);
