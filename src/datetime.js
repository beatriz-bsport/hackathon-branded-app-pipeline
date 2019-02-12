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

export function formatDuration(minutes) {
  const moduloMinutes = parseInt(minutes / 60, 10) * 60;
  return `${minutes % 60}h${moduloMinutes ? `${moduloMinutes}min` : ''}`;
}

export function formatMinutes(minutes) {
  const minutesNumber = parseInt(minutes, 10);
    if (minutesNumber < 60) {
      return `${minutesNumber}min`;
    }
    if (!(minutesNumber % 60)) {
      return `${parseInt(minutesNumber / 60, 10)}h${minutesNumber % 60}`;
    }
    return `${parseInt(minutesNumber / 60, 10)}h`;
}

export function humanizeDuration(milliseconds) {
  const seconds = milliseconds / 1000;
  const hours = parseInt(seconds / 3600, 10);
  const minutesNumber = parseInt((seconds % 3600) / 60, 10);

  // prettier-ignore
  let minutes = '';
  if (minutesNumber < 10) {
    if (minutesNumber === 0) {
      minutes = '';
    } else {
      minutes = `0${minutesNumber}`;
    }
  } else {
    minutes = `${minutesNumber}`;
  }

  if (hours) {
    return `${hours}H${minutes}`;
  }

  return `${minutes} min`;
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
