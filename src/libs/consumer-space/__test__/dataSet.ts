import { DateTime } from 'luxon';

/**
 * DATA SET 1
 */

const dateTime1 = DateTime.fromFormat('2020-02-02 06:00', 'yyyy-MM-dd HH:mm');

const all1 = [
  [
    { id: 0, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 1, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 2, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 3, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 4, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 5, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 6, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 7, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 8, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 9, offer_date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 10, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 11, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 12, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 13, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 14, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 15, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 16, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 17, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 18, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 19, date_start: dateTime1.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
];

// @ts-ignore
const bookings1 = [];
// @ts-ignore
const privateBookings1 = [];

all1.forEach((item) => {
  if (item[1] === 'booking') {
    bookings1.push(item[0]);
  } else {
    privateBookings1.push(item[0]);
  }
});

/**
 * DATA SET 2
 */

const dateTime2 = DateTime.fromFormat('2020-02-02 06:00', 'yyyy-MM-dd HH:mm');

const all2 = [
  [
    { id: 0, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 1, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 2, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 3, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 4, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 5, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 6, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 7, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 8, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 9, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 10, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 11, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 12, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 13, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 14, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 15, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 16, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 17, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 18, offer_date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 19, date_start: dateTime2.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
];
// @ts-ignore
const bookings2 = [];
// @ts-ignore
const privateBookings2 = [];

all2.forEach((item) => {
  if (item[1] === 'booking') {
    bookings2.push(item[0]);
  } else {
    privateBookings2.push(item[0]);
  }
});

/**
 * DATA SET 3
 */

const dateTime3 = DateTime.fromFormat('2020-02-02 02:00', 'yyyy-MM-dd HH:mm');

const all3 = [
  [
    { id: 0, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 1, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 2, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 3, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 4, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 5, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 6, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 7, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 8, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 9, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 10, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 11, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 12, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 13, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 14, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 15, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 16, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 17, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 18, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 19, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 20, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 21, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 22, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 23, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 24, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 25, date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'privateBooking',
  ],
  [
    { id: 26, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
  [
    { id: 27, offer_date_start: dateTime3.plus({ hours: 1 }).toISO() },
    'booking',
  ],
];
// @ts-ignore
const bookings3 = [];
// @ts-ignore
const privateBookings3 = [];

all3.forEach((item) => {
  if (item[1] === 'booking') {
    bookings3.push(item[0]);
  } else {
    privateBookings3.push(item[0]);
  }
});

export const DATA_SET_1 = {
  label: 'DATA SET 1',
  tag: 'A',
  all: all1,
  // @ts-ignore
  bookings: bookings1,
  // @ts-ignore
  privateBookings: privateBookings1,
};

export const DATA_SET_2 = {
  label: 'DATA SET 2',
  tag: 'B',
  all: all2,
  // @ts-ignore
  bookings: bookings2,
  // @ts-ignore
  privateBookings: privateBookings2,
};

export const DATA_SET_3 = {
  label: 'DATA SET 3',
  tag: 'C',
  all: all3,
  // @ts-ignore
  bookings: bookings3,
  // @ts-ignore
  privateBookings: privateBookings3,
};

export const DATA_SET = [DATA_SET_1, DATA_SET_2, DATA_SET_3];
