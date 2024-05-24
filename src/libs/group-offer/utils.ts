import { TFunction } from 'i18next';
import { DateTime, Settings } from 'luxon';
import {
  GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
} from './constants';
import { RecurrenceRuleGroupOffer } from './types';
import { toOrdinal } from '#src/i18n/utils/ordinals';

export const getDisplayDateFromRecurrence = (
  date: DateTime,
  recurrence_rule: RecurrenceRuleGroupOffer,
) => {
  if (!recurrence_rule) return date.toFormat('D');
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY)
    return date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  if (
    recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY
  ) {
    return getDisplayDateForWeekAndDay(date);
  }
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE) {
    return `${getDisplayDateForWeekAndDay(date)}, ${date.toFormat('MMMM')}`;
  }
  return '';
};

const getDisplayDateForWeekAndDay = (date: DateTime<true>) => {
  const weekOfMonth = getWeekOfMonth(date);
  return `${toOrdinal(weekOfMonth, Settings.defaultLocale)} ${date.toFormat(
    'cccc',
  )}`;
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
        until: DateTime.fromSeconds(recurrenceRule.until).toFormat('D'),
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

const getWeekOfMonth = (date: DateTime) => {
  return date.weekNumber - date.startOf('month').weekNumber + 1;
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
