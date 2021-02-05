import moment from 'moment';

/**
 * DATA SET 1
 */

const moment1 = moment('2020-02-02 06:00', 'YYYY-MM-DD HH:mm');

const all1 = [
  [{ id: 0, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 1, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 2, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 3, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 4, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 5, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 6, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 7, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 8, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 9, offer_date_start: moment1.add(1, 'h').format() }, 'booking'],
  [{ id: 10, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 11, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 12, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 13, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 14, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 15, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 16, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 17, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 18, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 19, date_start: moment1.add(1, 'h').format() }, 'privateBooking'],
];

const bookings1 = [];
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

const moment2 = moment('2020-02-02 06:00', 'YYYY-MM-DD HH:mm');

const all2 = [
  [{ id: 0, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 1, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 2, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 3, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 4, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 5, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 6, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 7, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 8, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 9, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 10, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 11, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 12, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 13, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 14, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 15, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 16, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 17, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 18, offer_date_start: moment2.add(1, 'h').format() }, 'booking'],
  [{ id: 19, date_start: moment2.add(1, 'h').format() }, 'privateBooking'],
];

const bookings2 = [];
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

const moment3 = moment('2020-02-02 02:00', 'YYYY-MM-DD HH:mm');

const all3 = [
  [{ id: 0, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 1, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 2, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 3, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 4, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 5, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 6, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 7, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 8, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 9, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 10, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 11, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 12, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 13, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 14, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 15, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 16, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 17, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 18, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 19, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 20, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 21, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 22, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 23, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 24, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 25, date_start: moment3.add(1, 'h').format() }, 'privateBooking'],
  [{ id: 26, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
  [{ id: 27, offer_date_start: moment3.add(1, 'h').format() }, 'booking'],
];

const bookings3 = [];
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
  bookings: bookings1,
  privateBookings: privateBookings1,
};

export const DATA_SET_2 = {
  label: 'DATA SET 2',
  tag: 'B',
  all: all2,
  bookings: bookings2,
  privateBookings: privateBookings2,
};

export const DATA_SET_3 = {
  label: 'DATA SET 3',
  tag: 'C',
  all: all3,
  bookings: bookings3,
  privateBookings: privateBookings3,
};

export const DATA_SET = [DATA_SET_1, DATA_SET_2, DATA_SET_3];
