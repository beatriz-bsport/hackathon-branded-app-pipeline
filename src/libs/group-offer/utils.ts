import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import {
  GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY,
  GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE,
} from './constants';
import { RecurrenceRuleGroupOffer } from './types';

export const getDisplayDateFromRecurrence = (
  date: DateTime,
  recurrence_rule: RecurrenceRuleGroupOffer,
  t: TFunction,
) => {
  if (!recurrence_rule) return date.toFormat('D');
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_WEEKLY_FREQUENCY)
    return date.toFormat('cccc');
  if (
    recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_MONTHLY_FREQUENCY
  ) {
    return getDisplayDateForWeekAndDay(date, t);
  }
  if (recurrence_rule.frequence === GROUPED_OFFERS_RECURSIVE_YEARLY_FREQUENCE)
    // TODO see with product. Old format: 'Mo MMMM'
    return `${date.toFormat('d MMMM')} - ${getDisplayDateForWeekAndDay(
      date,
      t,
    )}`;
  return '';
};

const getDisplayDateForWeekAndDay = (date: DateTime<true>, t: TFunction) => {
  if (getWeekOfMonth(date) < 5) {
    const weekOfDate = date.localWeekNumber;
    const weekOfStartOfMonth = date.startOf('month').localWeekNumber;

    // TODO see with product. Old format: 'Wo dddd'
    return DateTime.now()
      .set({
        localWeekday: date.localWeekday,
        localWeekNumber: weekOfDate - weekOfStartOfMonth || 1,
      })
      .toFormat('W EEEE');
  }

  return `${t('groupedOption.last')} ${date.toFormat('cccc')}`;
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
  return date.localWeekNumber - date.startOf('month').localWeekNumber + 1;
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
