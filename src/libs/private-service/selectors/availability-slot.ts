// @flow

import { RootState } from '../../../reducers';

const moment = require('moment-timezone');
import memoize from 'memoize-one';
import pickBy from 'lodash/pickBy';
import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { AvailabilitySlot, PrivateServiceState } from '../types';
import flatten from 'lodash/flatten';

export const DEFAULT_EXIST_CHECK: {
  loading: boolean,
  error?: Error,
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
        (v: any) =>
          moment(v.date_start).isSameOrAfter(periodFilter.start) &&
          moment(v.date_start).isSameOrBefore(periodFilter.end),
      );
    }
    return Object.values(slotsData);
  },
);

//@ts-ignore
export const getCoachAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, coach, periodFilter) => {
  if (coach) {
    return getAvailabilitySlots(state, periodFilter).filter(
      (s: AvailabilitySlot) => s.coach === coach,
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
      //@ts-ignore
      slots.map((s) => {
        const resource = resourceData[s.resource_identifier];
        return { ...s, color: resource ? resource.color : '' };
      }),
  ),
);

//@ts-ignore
export const getEstablishmentAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, establishment, periodFilter) => {
  if (establishment) {
    return getAvailabilitySlots(state, periodFilter).filter(
      //@ts-ignore
      (s) => s.establishment === establishment,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

//@ts-ignore
export const getPrivateServiceAvailabilitySlots: (
  State,
  number,
  PeriodFilter,
) => Array<AvailabilitySlot> = (state, privateServiceId, periodFilter) => {
  if (privateServiceId) {
    return getAvailabilitySlots(state, periodFilter).filter(
      //@ts-ignore
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
        //@ts-ignore
        resourceIdentifierList.includes(slot.resource_identifier),
      );
    }
    return slotsData;
  },
);

const _getSearchedSlotRaw = (state) =>
  state.privateService.availabilitySlot.searched.items;

export const getSearchedSlots: (
  state: RootState,
) => { [key: string]: Array<Array<string>> } = createSelector(
  _getSearchedSlotRaw,
  (slotByResourceList) => {
    const slotByDate = {};
    slotByResourceList.map((slotByResource) =>
      // eslint-disable-next-line
      slotByResource.slots.map((interval) => {
        const date = moment(interval[0]).format('YYYY-MM-DD');
        if (slotByDate[date]) {
          slotByDate[date].push(interval);
        } else {
          slotByDate[date] = [interval];
        }
      }),
    );
    return slotByDate;
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
          //@ts-ignore
          moment(v.date_start).isSameOrAfter(periodFilter.start) &&
          //@ts-ignore
          moment(v.date_start).isSameOrBefore(periodFilter.end),
      );
    }
    return Object.values(eventData);
  },
);

export const getSlotsByResourceIdentifier = (state, identifier) =>
  flatten(
    state.privateService.availabilitySlot.searched.items
      .filter((a) => a.resource_identifier === identifier)
      .map((a) => a.slots),
  );
