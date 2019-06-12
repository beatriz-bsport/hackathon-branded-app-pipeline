import { Moment } from './i18n';

export function formatAsDate(date) {
  const momentDate = Moment(date);
  return momentDate.format('DD/MM/YYYY');
}

export function formatAsTime(date) {
  const momentDate = Moment(date);
  return momentDate.format('LT');
}

export function formatAsDatetime(date) {
  return `${formatAsDate(date)} - ${formatAsTime(date)}`;
}

const WEEK_DAYS = [
  'time.weekday.monday',
  'time.weekday.tuesday',
  'time.weekday.wednesday',
  'time.weekday.thursday',
  'time.weekday.friday',
  'time.weekday.satursday',
  'time.weekday.sunday',
];

const MONTHS = [
  'time.month.january',
  'time.month.february',
  'time.month.march',
  'time.month.april',
  'time.month.may',
  'time.month.june',
  'time.month.july',
  'time.month.august',
  'time.month.september',
  'time.month.october',
  'time.month.november',
  'time.month.december',
];

export function formatMinutes(minutesNumber, t) {
  const minutesMinusDays = minutesNumber % (60 * 24);
  const minutesMinusHours = minutesNumber % 60;

  const days = parseInt(minutesNumber / (60 * 24), 10);
  const hours = parseInt(minutesMinusDays / 60, 10);

  let readableDuration = '';
  if (days) {
    readableDuration += `${days}${t('datetime.shortDayIdentifier')} `;
  }
  if (hours) {
    readableDuration += `${hours}${t('datetime.shortHourIdentifier')} `;
  }

  if (minutesMinusHours || readableDuration === '') {
    readableDuration += `${minutesMinusHours}${t(
      'datetime.shortMinuteIdentifier',
    )}`;
  }

  return readableDuration;
}

function getTime(d, fixed = false) {
  const hour = d.getHours();
  const minute = d.getMinutes();

  if (minute === 0 && !fixed) {
    return `${hour}H`;
  }

  const minutes = minute < 10 ? `0${minute}` : minute;
  return `${hour}H${minutes}`;
}

export function humanizeDate(date) {
  if (!date) {
    return '';
  }

  const d = new Date(date);

  const weekDay = WEEK_DAYS[d.getDay()];
  const month = MONTHS[d.getMonth()];
  const day = d.getDate();
  const shortWeekDay = weekDay !== undefined ? weekDay.slice(0, 3) : '';
  const dayShort = `${shortWeekDay} ${d.getDate()} ${month}.`;
  const time = getTime(d);

  const datetime = `${day} ${month}. ${time}`;
  return {
    weekDay,
    month,
    day,
    datetime,
    shortWeekDay,
    dayShort,
    time,
    timeFixed: getTime(d, true),
  };
}

export function isSameDay(date, date_) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getYear();

  const day_ = date_.getDate();
  const month_ = date_.getMonth();
  const year_ = date_.getYear();

  return day === day_ && month === month_ && year === year_;
}
