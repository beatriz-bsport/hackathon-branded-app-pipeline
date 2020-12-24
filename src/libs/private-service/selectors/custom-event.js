import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import memoize from 'memoize-one';
import { getCoaches } from '../../associated-coach/selectors.ts';

const periodFilterExtractor = (state, periodFilter) => periodFilter;
const _getCustomEventData = (state) => state.privateService.customEvent.byId;

export const getCustomEventList = createSelector(
  [_getCustomEventData, periodFilterExtractor],
  (customEventData, periodFilter) => {
    if (periodFilter) {
      return Object.values(customEventData).filter(
        (v) =>
          moment(v.date_start).isSameOrAfter(periodFilter.start) &&
          moment(v.date_start).isSameOrBefore(periodFilter.end),
      );
    }
    return Object.values(customEventData);
  },
);

export const getCustomEvent = (state, id) =>
  state.privateService.customEvent.byId[id];

export const withAssociatedCoach = memoize((selector) =>
  createSelector(
    [selector, getCoaches],
    (customEvent, coachList) => {
      if (!customEvent) return customEvent;
      if (Array.isArray(customEvent)) {
        return customEvent.map((ce) => ({
          ...ce,
          coaches: ce.coaches.map((c) =>
            coachList.find((c_) => c_.associatedcoach_set.includes(c)),
          ),
        }));
      }
      return {
        ...customEvent,
        coaches: customEvent.coaches.map((c) =>
          coachList.find((c_) => c_.associatedcoach_set.includes(c)),
        ),
      };
    },
  ),
);
