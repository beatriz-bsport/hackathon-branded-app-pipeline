import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import omit from 'lodash/omit';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import type { ConsumerPaymentPack } from '#src/libs/consumer-payment-pack/types';
import type { PrivatePassFilters } from '#src/libs/private-service/types';
import type {
  OffPeakSchedule,
  PaymentPack,
  PaymentPackFilters,
  PaymentPackTemplate,
  PaymentPackTemplateAPI,
  PaymentPackTemplatePaginatedBaseState,
} from './types';

export const getValidityInfo = (
  pack: PaymentPack | PaymentPackTemplate | PaymentPackTemplateAPI,
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
    const lower = DateTime.fromISO(
      // @ts-expect-error
      JSON.parse(validity_daterange).lower,
    ).toFormat('D');
    const upper = DateTime.fromISO(
      // @ts-expect-error
      JSON.parse(validity_daterange).upper,
    ).toFormat('D');
    dateInfo = `${t('validity')}${lower}${t('validityTo')}${upper}`;
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
// @ts-expect-error
export const getPaymentPackTimeLimitation = (paymentPack, baseDate) => {
  const { validity_daterange, duration_days, duration_months, duration_years } =
    paymentPack;

  if (!paymentPack) {
    return { start: null, end: null };
  }
  if (validity_daterange) {
    return {
      start: DateTime.fromISO(JSON.parse(validity_daterange).lower).toFormat(
        'D',
      ),
      end: DateTime.fromISO(JSON.parse(validity_daterange).upper).toFormat('D'),
    };
  }

  return {
    start: baseDate ? DateTime.fromISO(baseDate) : DateTime.now(),
    // TODO(BOO-746): The duration should be added to the base date too.
    end: baseDate
      ? DateTime.fromISO(baseDate)
      : DateTime.now().plus({
          days: (duration_days || 0) - 1,
          months: duration_months,
          years: duration_years,
        }),
  };
};

export const getPackDate = (consumerPack: ConsumerPaymentPack) => {
  const { ending_date, starting_date } = consumerPack;
  const startingDate = DateTime.fromISO(starting_date).toFormat('D');
  const endingDate = DateTime.fromISO(ending_date).toFormat('D');
  return [
    `${startingDate}→${endingDate}`,
    DateTime.fromISO(ending_date) < DateTime.now().plus({ days: 6 }),
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
) => {
  const { unlimited, theorical_margin_value, credits } = pack;
  let creditInfo: string = '';
  if (!unlimited) {
    creditInfo = `${getCreditsDividedValue(credits)}\u00A0${t('credits', {
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

/**
 *
 * @param {PaymentPackTemplatePaginatedBaseState} paginatedList - The paginated list of payment pack templates from which an element will be removed.
 * @returns {number} - The page number to refresh after removing an element from the paginated list:
 *                      - If the list has more than one element, it returns the current page.
 *                      - Otherwise, it returns the previous page or 1 if the current page is 1.
 */
export const getPaginatedPageToRefreshOnRemoval = (
  paginatedList: PaymentPackTemplatePaginatedBaseState,
) => {
  if (paginatedList.allIds.length > 1) {
    return paginatedList.page;
  }
  return Math.max(1, paginatedList.page - 1);
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
        credits: getCreditsDividedDisplay(paymentPack.credits),
      })
    : t('paymentPack:specifications.nbCredits', {
        credits: getCreditsDividedDisplay(paymentPack.credits),
      });
};

export const offPeakGroupDefault = () => {
  const todayDateNumber = DateTime.now()
    .setZone('UTC')
    .startOf('day')
    .weekday.toString();

  return {
    timeSlots: [
      [
        DateTime.now().set({ hour: 6, minute: 0, second: 0 }).toISO(),
        DateTime.now().set({ hour: 7, minute: 0, second: 0 }).toISO(),
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
    const startTime = DateTime.fromISO(start[0]);
    const endTimeSlot = DateTime.fromISO(end[0]);
    return startTime.diff(endTimeSlot).valueOf();
  });
};

// This method format every [start,end] of timeslot into HH:mm
const stringifyTimeSlots = (timeSlots: string[][]): string[][] => {
  return timeSlots.map((timeSlot) => {
    const formattedTimeSlot = [
      DateTime.fromISO(timeSlot[0]).toFormat('HH:mm'),
      DateTime.fromISO(timeSlot[1]).toFormat('HH:mm'),
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
          DateTime.now().set({ hour: 0, minute: 0, second: 0 }).toISO(),
          DateTime.now().set({ hour: 23, minute: 59, second: 59 }).toISO(),
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
    const dateTimeSlots = [timeSlots.shift()];
    timeSlots.forEach((timeArray) => {
      const [current_start_time, current_end_time] = [
        DateTime.fromISO(timeArray[0]),
        DateTime.fromISO(timeArray[1]),
      ];
      const [last_start_time, last_end_time] = dateTimeSlots.slice(-1)[0];
      if (
        current_start_time.startOf('minute') <=
        DateTime.fromISO(last_end_time).startOf('minute')
      ) {
        const maxEndTime =
          current_end_time.startOf('minute') >=
          DateTime.fromISO(last_end_time).startOf('minute')
            ? current_end_time
            : DateTime.fromISO(last_end_time);
        dateTimeSlots[dateTimeSlots.length - 1] = [
          last_start_time,
          maxEndTime.toISO(),
        ];
      } else {
        dateTimeSlots.push([
          current_start_time.toISO(),
          current_end_time.toISO(),
        ]);
      }
    });
    const sanithizedTimeSlot = stringifyTimeSlots(dateTimeSlots);
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
      return [
        DateTime.fromFormat(start, 'HH:mm').toISO(),
        DateTime.fromFormat(end, 'HH:mm').toISO(),
      ];
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
      DateTime.fromISO(formattedTimeSlotValue[0][0]).toFormat('HH:mm') ===
        '00:00' &&
      DateTime.fromISO(formattedTimeSlotValue[0][1]).toFormat('HH:mm') ===
        '23:59';

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

/**
 * Checks if a user has permission to manage payment packs (credits or block).
 *
 * - If the payment pass is unlimited, the user must have the permission to block the payment pack.
 * - Otherwise, the user must have the permission to manage the credits.
 * - Finally, if the payment_pack.unlimited is null or undefined, the user has no permission.
 *
 * @param paymentPack - The payment pack.
 * @param hasManageCreditPermission - Indicates if the user has permission to manage the credits.
 * @param hasBlockPermission - Indicates if the user has permission to block payment packs.
 * @returns A boolean value indicating if the user has payment pack management permission.
 */
export const hasPaymentPackManagementPermission = (
  paymentPack: PaymentPack,
  hasManageCreditPermission: boolean,
  hasBlockPermission: boolean,
): boolean => {
  if (paymentPack?.unlimited) {
    return hasBlockPermission;
  }
  if (paymentPack?.unlimited === false) {
    return hasManageCreditPermission;
  }
  return false;
};

export const CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_BOOKING = 0;
export const CONSUMER_PAYMENT_PACK_CREDIT_NOTIFICATION_COUNTDOWN_ON_OFFER_START = 1;
