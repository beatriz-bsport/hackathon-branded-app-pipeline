import moment from 'moment-timezone';
import { TFunction } from 'i18next';
import { SubscriptionPause } from './types';
import { BILLING_PLAN_STATUS_IS_PAUSED } from './constants';

const BILLING_PLAN_STATUS_HAS_STARTED = 2;
const BILLING_PLAN_STATUS_HAS_STOPPED = 3;
const BILLING_PLAN_STATUS_HAS_ENDED = 4;

export function isPaused(pausesArray: Array<SubscriptionPause>) {
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

export const getStatus = (status: number, t: TFunction) => {
  if (status === BILLING_PLAN_STATUS_HAS_STARTED) return t('status.hasStarted');
  if (status === BILLING_PLAN_STATUS_HAS_ENDED) return t('status.hasEnded');
  if (status === BILLING_PLAN_STATUS_HAS_STOPPED) return t('status.hasStopped');
  if (status === BILLING_PLAN_STATUS_IS_PAUSED) return t('status.isPaused');
  return t('status.hasNotStartedYet');
};
