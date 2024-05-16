import { DateTime } from 'luxon';
import pickBy from 'lodash/pickBy';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';

import { RootState } from '../../../reducers';
import { AvailabilitySlot, PrivateServiceState } from '../types';
import { getMyAssociatedCoachProfile } from '#libs/associated-coach/selectors';

type Period = { start: string; end: string };

export const DEFAULT_EXIST_CHECK: {
  loading: boolean;
  error?: Error;
  exists: boolean;
} = Immutable({
  loading: true,
  error: null,
  exists: false,
});

export const groupByResourceDatatype = (stuff: any) =>
  Object.entries(groupBy(stuff, 'datatype')).reduce(
    (acc, [datatype, data]) => [...acc, { datatype, data }],
    [],
  );

const _getAvailabilitySlotsData = (state: RootState) =>
  state.privateService.availabilitySlot.byId;

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

const periodFilterExtractor = (state: RootState, periodFilter: Period) =>
  periodFilter;

export const getAvailabilitySlots = createSelector(
  [_getAvailabilitySlotsData, periodFilterExtractor],
  (slotsData, periodFilter) => {
    if (periodFilter) {
      return Immutable(
        Object.values(slotsData).filter(
          (v) =>
            DateTime.fromISO(v.date_start) >=
              DateTime.fromISO(periodFilter.start) &&
            DateTime.fromISO(v.date_start) <=
              DateTime.fromISO(periodFilter.end),
        ),
      );
    }
    return Immutable(Object.values(slotsData));
  },
);

export const getMyAvailabilitySlots = createSelector(
  [
    _getAvailabilitySlotsData,
    periodFilterExtractor,
    getMyAssociatedCoachProfile,
  ],
  (slotsData, periodFilter, meAsCoach) => {
    if (!meAsCoach) {
      return [];
    }
    if (periodFilter) {
      return Object.values(slotsData).filter(
        (v) =>
          DateTime.fromISO(v.date_start) >=
            DateTime.fromISO(periodFilter.start) &&
          DateTime.fromISO(v.date_start) <=
            DateTime.fromISO(periodFilter.end) &&
          v.coach === meAsCoach.id,
      );
    }
    return Object.values(slotsData).filter((s) => s.coach === meAsCoach.id);
  },
);

export const getCoachAvailabilitySlots = (
  state: RootState,
  coach: number,
  periodFilter: Period,
): Immutable.ImmutableArray<AvailabilitySlot> => {
  if (coach) {
    return getAvailabilitySlots(state, periodFilter).filter(
      (s) => s.coach === coach,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getPrivateServiceResourceData = (
  state: RootState,
  serviceId: string,
) => {
  const stuff = pickBy(
    state.privateService.resource.byId,
    (resource) => `${resource.private_service}` === `${serviceId}`,
  );
  return groupByResourceDatatype(stuff);
};

const _getResourceData = (state: RootState) =>
  state.privateService.resource.byId;
const _getResourceIds = (state: RootState) =>
  state.privateService.resource.allIds;

export const getResourceDataList = createSelector(
  [_getResourceData, _getResourceIds],
  (data, ids) => groupByResourceDatatype(ids.map((id) => data[id])),
);

export const getEstablishmentAvailabilitySlots = (
  state: RootState,
  establishment: number,
  periodFilter: Period,
): Immutable.ImmutableArray<AvailabilitySlot> => {
  if (establishment) {
    return getAvailabilitySlots(state, periodFilter).filter(
      // @ts-ignore
      (s) => s.establishment === establishment,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getPrivateServiceAvailabilitySlots = (
  state: RootState,
  privateServiceId: number,
  periodFilter: Period,
): Immutable.ImmutableArray<AvailabilitySlot> => {
  if (privateServiceId) {
    return getAvailabilitySlots(state, periodFilter).filter(
      // @ts-ignore
      (s) => s.private_service === privateServiceId,
    );
  }
  return getAvailabilitySlots(state, periodFilter);
};

export const getFilteredAvailabilitySlots = createSelector(
  [
    getAvailabilitySlots,
    (state, periodFilter, resourceIdentifierList) => resourceIdentifierList,
    _getResourceData,
  ],
  (slotsData, resourceIdentifierList, resourceData) => {
    if (resourceIdentifierList) {
      return slotsData
        .filter((slot) =>
          resourceIdentifierList.includes(slot.resource_identifier),
        )
        .map((s) => {
          const resource = resourceData[s.resource_identifier];
          return Immutable({ ...s, color: resource ? resource.color : '' });
        });
    }
    return slotsData.map((s) => {
      const resource = resourceData[s.resource_identifier];
      return Immutable({ ...s, color: resource ? resource.color : '' });
    });
  },
);

const _getSearchedSlotRaw = (state: RootState) =>
  state.privateService.availabilitySlot.searched.items;

export const getSearchedSlots: (state: RootState) => {
  [key: string]: string[][];
} = createSelector(_getSearchedSlotRaw, (slotByResourceList) => {
  const slotByDate: { [key: string]: string[][] } = {};
  slotByResourceList.map((slotByResource) =>
    // eslint-disable-next-line
    slotByResource.slots.map((interval) => {
      const date = DateTime.fromISO(interval[0]).toISODate();
      if (slotByDate[date]) {
        slotByDate[date].push(interval);
      } else {
        slotByDate[date] = [interval];
      }
    }),
  );
  return slotByDate;
});

const _getCalendarEventData = (state: RootState) =>
  state.privateService.calendarEvent.byId;

export const getFilteredCalendarEvents = createSelector(
  [_getCalendarEventData, periodFilterExtractor],
  (eventData, periodFilter) => {
    if (periodFilter) {
      return Object.values(eventData).filter(
        (v) =>
          // @ts-ignore
          DateTime.fromISO(v.date_start) >=
            DateTime.fromISO(periodFilter.start) &&
          // @ts-ignore
          DateTime.fromISO(v.date_start) <= DateTime.fromISO(periodFilter.end),
      );
    }
    return Object.values(eventData);
  },
);

export const getSlotsByResourceIdentifier = (
  state: RootState,
  identifier: string,
) =>
  flatten(
    state.privateService.availabilitySlot.searched.items
      .filter((a) => a.resource_identifier === identifier)
      .map((a) => a.slots),
  );

export const getNextDateAvailableSlot = (state: RootState) =>
  state.privateService.availabilitySlot.next.date;
