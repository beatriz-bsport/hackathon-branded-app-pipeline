import moment from 'moment-timezone';

const BILLING_PLAN_STATUS_HAS_STARTED = 2;
const BILLING_PLAN_STATUS_HAS_STOPPED = 3;
const BILLING_PLAN_STATUS_HAS_ENDED = 4;

export function isPaused(pausesArray) {
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      moment().isBetween(
        moment(p.date_created),
        moment(p.date_created).add(p.days, 'days'),
      ),
    false,
  );
}

export const getStatus = (status, t) => {
  if (status === BILLING_PLAN_STATUS_HAS_STARTED) return t('status.hasStarted');
  if (status === BILLING_PLAN_STATUS_HAS_ENDED) return t('status.hasEnded');
  if (status === BILLING_PLAN_STATUS_HAS_STOPPED) return t('status.hasStopped');
  return t('status.hasNotStartedYet');
};
