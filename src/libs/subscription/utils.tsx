import moment from 'moment-timezone';
import { SubscriptionPause } from './types';

export function isPaused(pausesArray?: Array<SubscriptionPause>) {
  if (!pausesArray?.length) return false;
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      moment().isBetween(
        moment(p.from_date),
        moment(p.until_date),
        'days',
        '[]',
      ),
    false,
  );
}
