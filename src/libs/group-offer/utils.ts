import { TFunction } from 'i18next';
import moment, { Moment } from 'moment-timezone';
import {
  GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
} from './constants';
import { RecurrenceRuleGroupOffer } from './types';

export const getDisplayDateFromRecurrence = (
  date: Moment,
  recurrence_rule: RecurrenceRuleGroupOffer,
  t: TFunction,
) => {
  if (!recurrence_rule) return date.format('L');
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY)
    return date.format('dddd');
  if (
    recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY
  ) {
    return getDisplayDateForWeekAndDay(date, t);
  }
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE)
    return `${date.format('Mo MMMM')} - ${getDisplayDateForWeekAndDay(
      date,
      t,
    )}`;
  return '';
};

const getDisplayDateForWeekAndDay = (date: Moment, t: TFunction) => {
  if (getWeekOfMonth(date) < 5) {
    const weekOfDate = date.clone().week();
    const weekOfStartOfMonth = date.clone().startOf('month').week();

    return moment()
      .week(weekOfDate - weekOfStartOfMonth || 1)
      .day(date.clone().day())
      .format('Wo dddd');
  }

  return `${t('groupedOption.last')} ${date.format('dddd')}`;
};

export const getRecurrenceTrad = (
  recurrenceRule: RecurrenceRuleGroupOffer,
  t: TFunction,
) => {
  if (recurrenceRule.until) {
    return t(
      `metaActivity:groupedOption.intervalLabel.until.${
        FREQUENCE_STRING_CONVERTER[recurrenceRule.frequence]
      }`,
      {
        count: recurrenceRule.interval,
        until: moment.unix(recurrenceRule.until).format('L'),
      },
    );
  }

  return t(
    `metaActivity:groupedOption.intervalLabel.${
      FREQUENCE_STRING_CONVERTER[recurrenceRule.frequence]
    }`,
    {
      count: recurrenceRule.interval,
    },
  );
};

const getWeekOfMonth = (date: Moment) => {
  return date.week() - moment(date).startOf('month').week() + 1;
};

export const FREQUENCE_STRING_CONVERTER: Record<number, string> = {
  [GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY]: 'week',
  [GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY]: 'month',
  [GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE]: 'year',
};

export const FREQUENCE_NUMBER_CONVERTER: Record<string, number> = {
  week: GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  month: GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  year: GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
};
