import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import memoize from 'memoize-one';
import { RootState } from '../../../reducers';
import { getCoaches } from '../../associated-coach/selectors';
import { Period } from '#libs/types';

const periodExtractor = (state: RootState, period: Period) => period;

const _getCustomEventData = (state: RootState) =>
  state.privateService.customEvent.byId;

export const getCustomEventList = createSelector(
  [_getCustomEventData, periodExtractor],
  (customEventData, period) => {
    if (period) {
      return Object.values(customEventData).filter((v) => {
        return (
          moment(v.date_start).isSameOrAfter(moment(period.start), 'day') &&
          moment(v.date_start).isSameOrBefore(moment(period.end), 'day')
        );
      });
    }
    return Object.values(customEventData);
  },
);

export const getCustomEvent = (state: RootState, id: number) =>
  state.privateService.customEvent.byId[id];

export const withAssociatedCoach = memoize((selector) =>
  createSelector([selector, getCoaches], (customEvent, coachList) => {
    if (!customEvent) return customEvent;
    if (Array.isArray(customEvent)) {
      return customEvent.map((ce) => ({
        ...ce,
        coaches: ce.coaches.map((c: number) =>
          coachList.find((c_) => c_.associatedcoach_set.includes(c)),
        ),
      }));
    }
    return {
      ...customEvent,
      coaches: customEvent.coaches.map((c: number) =>
        coachList.find((c_) => c_.associatedcoach_set.includes(c)),
      ),
    };
  }),
);
