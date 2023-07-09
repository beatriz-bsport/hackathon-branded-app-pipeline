// @ts-nocheck
import { TFunction } from 'i18next';
import moment, { Moment } from 'moment-timezone';
import omit from 'lodash/omit';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';
import { formatAsDate } from '../../utils/datetime';
import type { ConsumerPaymentPack } from '../consumer-payment-pack/types';
import {
  OffPeakSchedule,
  PaymentPack,
  PaymentPackFilters,
  PaymentPackTemplate,
} from './types';
import { PrivatePassFilters } from '#libs/private-service/types';

export const getValidityInfo = (
  pack: PaymentPack | PaymentPackTemplate,
  t: TFunction,
  startInfo: boolean = false,
) => {
  let dateInfo = t('validForDuration.valid');
  const {
    validity_daterange,
    duration_days,
    duration_months,
    duration_years,
    start_date_method,
  } = pack;

  if (duration_years) {
    dateInfo += t('validForDuration.years', {
      count: duration_years,
    });
  }
  if (duration_years && duration_months && duration_days) {
    dateInfo += ', ';
  }
  if (duration_years && duration_months && !duration_days) {
    dateInfo += t('validForDuration.and');
  }
  if (duration_months) {
    dateInfo += t('validForDuration.months', {
      count: duration_months,
    });
  }
  if ((duration_years || duration_months) && duration_days) {
    dateInfo += t('validForDuration.and');
  }
  if (duration_days) {
    dateInfo += t('validForDuration.days', { count: duration_days });
  }
  if (validity_daterange) {
    dateInfo = `${t('validity')}${formatAsDate(
      moment(JSON.parse(validity_daterange).lower),
    )}${t('validityTo')}${formatAsDate(
      moment(JSON.parse(validity_daterange).upper),
    )}`;
  }
  if (!validity_daterange && !!dateInfo && startInfo) {
    if (start_date_method === 0) {
      dateInfo += ` ${t('validForDuration.booking')}`;
    }
    if (start_date_method === 1) {
      dateInfo += ` ${t('validForDuration.attendance')}`;
    }
    if (start_date_method === 2) {
      dateInfo += ` ${t('validForDuration.purchase')}`;
    }
  }

  return dateInfo;
};

export const getTagInfo = (pack: PaymentPack, t: TFunction) => {
  const { blacklist_tags = [], whitelist_tags = [] } = pack;
  const nb_whitelistTags = whitelist_tags.length;
  const nb_blacklistTags = blacklist_tags.length;
  let tagInfo = '';
  if (nb_blacklistTags && nb_whitelistTags) {
    tagInfo = `${t('tags.whiteList', {
      count: nb_whitelistTags,
    })} - ${t('tags.blackList', {
      count: nb_blacklistTags,
    })}`;
  }
  if (nb_blacklistTags && !nb_whitelistTags) {
    tagInfo = t('tags.blackList', {
      count: nb_blacklistTags,
    });
  }

  if (!nb_blacklistTags && nb_whitelistTags) {
    tagInfo = t('tags.whiteList', {
      count: nb_whitelistTags,
    });
  }

  return tagInfo;
};

export const getValidityString = (
  duration_day: number,
  duration_month: number,
  duration_year: number,
  t: TFunction,
) => {
  let dateInfo = '';

  if (duration_year) {
    if (duration_month) {
      if (duration_day) {
        dateInfo = t('addPaymentPack.validForDuration.year', {
          duration_day,
          duration_month,
          duration_year,
        });
        return dateInfo;
      }
      dateInfo = t('addPaymentPack.validForDuration.yearNoDay', {
        duration_month,
        duration_year,
      });
      return dateInfo;
    }
    if (duration_day) {
      dateInfo = t('addPaymentPack.validForDuration.yearDayNoMonth', {
        duration_day,
        duration_year,
      });
      return dateInfo;
    }
    dateInfo = t('addPaymentPack.validForDuration.yearNoDayNoMonth', {
      duration_year,
    });
    return dateInfo;
  }
  if (duration_month) {
    if (duration_day) {
      dateInfo = t('addPaymentPack.validForDuration.month', {
        duration_day,
        duration_month,
      });
      return dateInfo;
    }
    dateInfo = t('addPaymentPack.validForDuration.monthNoDay', {
      duration_month,
    });
    return dateInfo;
  }
  if (duration_day) {
    dateInfo = t('addPaymentPack.validForDuration.day', {
      duration_day,
    });
    return dateInfo;
  }
  return dateInfo;
};

export const getPaymentPackTimeLimitation = (paymentPack, baseDate) => {
  const { validity_daterange, duration_days, duration_months, duration_years } =
    paymentPack;

  if (!paymentPack) {
    return { start: null, end: null };
  }
  if (validity_daterange) {
    return {
      start: moment(JSON.parse(validity_daterange).lower),
      end: moment(JSON.parse(validity_daterange).upper),
    };
  }

  return {
    start: moment(baseDate || moment()),
    end: moment(baseDate || moment())
      .add('days', duration_days || 0)
      .add('months', duration_months || 0)
      .add('years', duration_years || 0)
      .add('days', -1),
  };
};

export const getPackDate = (consumerPack: ConsumerPaymentPack) => {
  const { ending_date, starting_date } = consumerPack;
  return [
    `${formatAsDate(starting_date)}→${formatAsDate(ending_date)}`,
    moment(ending_date).isBefore(moment().add(6, 'day')),
  ];
};

export const paymentPackTagsAndMemberTagsCompatibilty = (
  paymentPack: PaymentPack,
  TagList: Array<number>,
) => {
  if (
    paymentPack?.whitelist_tags?.length === 0 &&
    paymentPack?.blacklist_tags?.length === 0
  ) {
    return false;
  }

  return !(
    (paymentPack?.whitelist_tags?.length !== 0 &&
      paymentPack?.whitelist_tags?.some((tag) => TagList?.includes(tag))) ||
    (paymentPack?.blacklist_tags?.length !== 0 &&
      !paymentPack?.blacklist_tags?.some((tag) => TagList?.includes(tag)))
  );
};

export const getCompatibilityInfo = (pack: PaymentPack, t: TFunction) => {
  const { categories, establishments, metaActivities } = pack;
  const nb_categories = categories.length;
  const nb_activities = metaActivities.length;
  const nb_establishments = establishments.length;
  if (!nb_categories && !establishments.length && !metaActivities.length) {
    return t('compatibility.all');
  }

  let compatibilityInfo = t('compatibility.compatible');
  if (nb_categories) {
    compatibilityInfo += t('compatibility.categories', {
      count: nb_categories,
    });
  }
  if (nb_categories && nb_activities && nb_establishments) {
    compatibilityInfo += ', ';
  }
  if (nb_categories && nb_activities && !nb_establishments) {
    compatibilityInfo += t('compatibility.and');
  }
  if (nb_activities) {
    compatibilityInfo += t('compatibility.activities', {
      count: nb_activities,
    });
  }
  if ((nb_categories || metaActivities.length) && nb_establishments) {
    compatibilityInfo += t('compatibility.and');
  }
  if (nb_establishments) {
    compatibilityInfo += t('compatibility.establishments', {
      count: nb_establishments,
    });
  }

  return compatibilityInfo;
};

export const getCreditInfo = (
  pack: PaymentPack | PaymentPackTemplate,
  t: TFunction,
  isManager: boolean = false,
  creditScaleFactor: number = 1,
) => {
  const { unlimited, theorical_margin_value, credits } = pack;
  let creditInfo: string = '';
  if (!unlimited) {
    creditInfo = `${credits / (creditScaleFactor || 1)}\u00A0${t('credits', {
      count: credits,
    }).toLowerCase()}`;
  } else {
    creditInfo = t('unlimitedPlural');
    if (isManager) {
      if (theorical_margin_value > 0) {
        creditInfo +=
          t('unlimitedAndMargin') +
          getCurrencyDisplayWithPrice(theorical_margin_value);
      } else {
        creditInfo += t('unlimitedAndCalculatedMargin');
      }
    }
  }
  return creditInfo;
};

export const setGenericFilterValue = (
  filters: PaymentPackFilters | PrivatePassFilters,
  filterDict: PaymentPackFilters | PrivatePassFilters,
  setFilters: (filters: PaymentPackFilters | PrivatePassFilters) => void,
) => {
  const newFilters = Object.keys(filterDict).reduce(
    (
      acc: PaymentPackFilters | PrivatePassFilters,
      name: keyof PaymentPackFilters | keyof PrivatePassFilters,
    ) => {
      if (filterDict[name] == null) {
        return omit(acc, name);
      }

      acc[name] = filterDict[name];
      return acc;
    },
    filters,
  );
  setFilters(newFilters);
};

export const getMarketplaceSearchItemIndicator = (
  paymentPack: PaymentPack,
  t: TFunction,
) => {
  if (paymentPack?.unlimited) {
    return t('paymentPack:specifications.unlimitedCredits');
  }
  return paymentPack?.credits > 1
    ? t('paymentPack:specifications.nbCredits_plural', {
        credits: paymentPack.credits,
      })
    : t('paymentPack:specifications.nbCredits', {
        credits: paymentPack.credits,
      });
};

export const offPeakGroupDefault = () => {
  const todayDateNumber = moment()
    .tz('UTC')
    .startOf('day')
    .isoWeekday()
    .toString();

  return {
    timeSlots: [
      [
        moment().hours(6).minutes(0).seconds(0).format(),
        moment().hours(7).minutes(0).seconds(0).format(),
      ],
    ],
    recurrenceWeekDay: {
      '1': todayDateNumber === '1',
      '2': todayDateNumber === '2',
      '3': todayDateNumber === '3',
      '4': todayDateNumber === '4',
      '5': todayDateNumber === '5',
      '6': todayDateNumber === '6',
      '7': todayDateNumber === '7',
    },
    slotDurationChoice: 'time_slot',
  };
};

const sortTimeSlotsByStartDate = (timeSlot: string[][]) => {
  timeSlot.sort((start, end) => {
    return moment(start[0]).diff(end[0]);
  });
};

// This method format every [start,end] of timeslot into HH:mm
const stringifyTimeSlots = (timeSlots: string[][]): string[][] => {
  return timeSlots.map((timeSlot) => {
    const formattedTimeSlot = [
      moment(timeSlot[0]).format('HH:mm'),
      moment(timeSlot[1]).format('HH:mm'),
    ];
    return formattedTimeSlot;
  });
};

/* This method format off_peak_schedule because they don't have the same typing in the 
front-end and the back-end */
export const formatOffPeakScheduleOnSubmit = (
  off_peak_schedule: OffPeakSchedule[],
): Record<string, string[][]> => {
  /* This part format the off_peak_schedule from the front-end to the format 
  of the back-end */
  const sanitizedOffPeakSchedule = {} as Record<string, string[][]>;
  off_peak_schedule.forEach((group) => {
    const groupedTimeSlots = [] as string[][];
    group.slotDurationChoice === 'all_day'
      ? groupedTimeSlots.push([
          moment().hours(0).minutes(0).seconds(0).format(),
          moment().hours(23).minutes(59).seconds(59).format(),
        ])
      : group.timeSlots.forEach((timeSlot) => {
          groupedTimeSlots.push(timeSlot);
        });
    Object.entries(group.recurrenceWeekDay).forEach((day) => {
      const [isoWeekday, active] = day;
      if (active) {
        if (!sanitizedOffPeakSchedule[isoWeekday]) {
          sanitizedOffPeakSchedule[isoWeekday] = [];
        }
        groupedTimeSlots.forEach((timeSlotBis) => {
          sanitizedOffPeakSchedule[isoWeekday].push([...timeSlotBis]);
        });
      }
    });
  });

  // This part manages the merge of overlapped timeslots and format moment into string
  const formattedOffPeakSchedule = {} as Record<string, string[][]>;
  Object.entries(sanitizedOffPeakSchedule).forEach((day) => {
    const [isoWeekday, timeSlots]: [string, string[][]] = day;
    sortTimeSlotsByStartDate(timeSlots);
    const momentTimeSlots = [timeSlots.shift()];
    timeSlots.forEach((timeArray) => {
      const [current_start_time, current_end_time]: [Moment, Moment] = [
        moment(timeArray[0]),
        moment(timeArray[1]),
      ];
      const [last_start_time, last_end_time] = momentTimeSlots.slice(-1)[0];
      if (current_start_time.isSameOrBefore(moment(last_end_time), 'minute')) {
        const maxEndTime = current_end_time.isSameOrAfter(
          moment(last_end_time),
          'minute',
        )
          ? current_end_time
          : moment(last_end_time);
        momentTimeSlots[momentTimeSlots.length - 1] = [
          last_start_time,
          maxEndTime.format(),
        ];
      } else {
        momentTimeSlots.push([
          current_start_time.format(),
          current_end_time.format(),
        ]);
      }
    });
    const sanithizedTimeSlot = stringifyTimeSlots(momentTimeSlots);
    formattedOffPeakSchedule[isoWeekday] = sanithizedTimeSlot;
  });
  return formattedOffPeakSchedule;
};

export const groupByTimeSlot = (
  off_peak_schedule: Record<string, string[][]>,
): Record<string, string[]> => {
  const allTimeSlots = {} as Record<string, string[]>;

  Object.entries(off_peak_schedule).forEach((days) => {
    const [isoWeekday, timeSlots] = days;
    Object.entries(timeSlots).forEach((timeSlot) => {
      const slotArray = timeSlot[1];
      const slotString = slotArray.join(',');
      if (!allTimeSlots[slotString]) {
        allTimeSlots[slotString] = [];
      }
      allTimeSlots[slotString].push(isoWeekday);
    });
  });
  return allTimeSlots;
};

export const formatOffPeakScheduleOnEdit = (
  off_peak_schedule: Record<string, string[][]>,
): OffPeakSchedule[] => {
  const formattedOffPeakScheduleOnEdit = [] as OffPeakSchedule[];
  const daysGroupedByTimeSlot = groupByTimeSlot(off_peak_schedule);
  const groups = {} as Record<string, string[]>;

  /* On this part, the OffPeakScheduleGroups are grouped by timeslots in order to minimize
  the number of groups and to try to have the same groups as the input  */
  Object.entries(daysGroupedByTimeSlot).forEach(
    ([timeSlot, daysArray]: [string, string[]]) => {
      const daysString = daysArray.join(',');
      if (!groups[daysString]) {
        groups[daysString] = [];
      }
      groups[daysString].push(timeSlot);
    },
  );

  // On this part, I recreate the different OffPeakScheduleGroups based on the front-end format
  Object.entries(groups).forEach(([days, timeSlot]: [string, string[]]) => {
    let slotDurationChoiceValue = '';

    const formattedTimeSlotValue = timeSlot.map((slot) => {
      const [start, end] = slot.split(',');
      return [moment(start, 'HH:mm').format(), moment(end, 'HH:mm').format()];
    });

    const groupedDays = days.split(',');
    const recurrenceWeekDayValue = {
      '1': groupedDays.includes('1'),
      '2': groupedDays.includes('2'),
      '3': groupedDays.includes('3'),
      '4': groupedDays.includes('4'),
      '5': groupedDays.includes('5'),
      '6': groupedDays.includes('6'),
      '7': groupedDays.includes('7'),
    };

    // From the back-end, if the slot duration choice was all_day, it only has 1 timeslot
    const isAllDay =
      moment(formattedTimeSlotValue[0][0]).format('HH:mm') === '00:00' &&
      moment(formattedTimeSlotValue[0][1]).format('HH:mm') === '23:59';

    if (isAllDay) {
      slotDurationChoiceValue = 'all_day';
    } else {
      slotDurationChoiceValue = 'time_slot';
    }
    formattedOffPeakScheduleOnEdit.push({
      timeSlots: formattedTimeSlotValue,
      recurrenceWeekDay: recurrenceWeekDayValue,
      slotDurationChoice: `${slotDurationChoiceValue}`,
    });
  });
  return formattedOffPeakScheduleOnEdit;
};

export const CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING = 0;
export const CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_OFFER_START = 1;
