import moment from 'moment';
import { store, setBookings, setPrivateBookings } from './actionTestHelper';
import { fetchBookingsAndPrivateBookings } from '../actions';
import { DATA_SET_1, DATA_SET_2, DATA_SET_3 } from './dataSet';

jest.setTimeout(30000);

describe('☻ BOOKING AND PRIVATE BOOKING ACTION PAGINATION', () => {
  describe('A) GIVEN 10 BOOKING THAT START BEFORE 10 PRIVATE BOOKING', () => {
    setBookings(DATA_SET_1.bookings);
    setPrivateBookings(DATA_SET_1.privateBookings);

    describe('A1) WHEN USER REQUEST THE FIRST PAGE', () => {
      test('A1) allObj should contain 10 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            page: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );
        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(10);
      });

      test('A1) Each items from allObj should be of type "bookings"', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj) => {
          expect(obj.type).toBe('booking');
          expect(obj.booking).toBeDefined();
        });
      });

      test('A1) Each items from allObj should match the id from the source array"', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj[obj.type]).toBe(DATA_SET_1.all[i][0].id);
        });
      });
    });

    describe('A2) WHEN USER REQUEST THE SECOND PAGE', () => {
      test('A2) allObj should contain 20 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );

        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(20);
      });

      test('A2) First 10 items should be of type booking and the next 10 of type privateBooking"', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj.type).toBe(DATA_SET_1.all[i][1]);
        });
      });

      test('A2) Each items from allObj should match the correct id"', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj[obj.type]).toBe(DATA_SET_1.all[i][0].id);
        });
      });
    });

    describe('A3) WHEN USER REQUEST THE THIRD PAGE', () => {
      test('A3) allObj should contain 20 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );
        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(20);
      });
    });
  });

  describe('B) GIVEN 20 ITEMS, EVEN = BOOKING AND ODD = PRIVATE BOOKING ', () => {
    describe('B1) WHEN USER REQUEST THE FIRST PAGE', () => {
      test('B1) allObj should contain 10 objects', async () => {
        store.dispatch({ type: '__RESET_STORE__' });

        setBookings(DATA_SET_2.bookings);
        setPrivateBookings(DATA_SET_2.privateBookings);

        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            page: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );

        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(10);
      });

      test('B1) allObj should be sorted by date', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj[obj.type]).toBe(DATA_SET_2.all[i][0].id);
        });
      });
    });

    describe('B2) WHEN USER REQUEST THE SECOND PAGE', () => {
      it('B2) allObj should contain 20 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );

        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(20);
      });

      it('B2) allObj should be sorted by date', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj.type).toBe(DATA_SET_2.all[i][1]);
          expect(obj[obj.type]).toBe(DATA_SET_2.all[i][0].id);
        });
      });
    });

    describe('B3) WHEN USER REQUEST THE THIRD PAGE', () => {
      it('B3) allObj should contain 20 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );
        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(20);
      });
    });
  });

  describe('C) CUSTOM DATA SET 1', () => {
    describe('C1) WHEN USER REQUEST THE FIRST PAGE', () => {
      test('C1) allObj should contain 10 objects', async () => {
        store.dispatch({ type: '__RESET_STORE__' });

        setBookings(DATA_SET_3.bookings);
        setPrivateBookings(DATA_SET_3.privateBookings);

        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            page: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );

        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(10);
      });

      test('C1) allObj should be sorted by date', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;

        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj.type).toBe(DATA_SET_3.all[i][1]);
          expect(obj[obj.type]).toBe(DATA_SET_3.all[i][0].id);
        });
      });
    });

    describe('C2) WHEN USER REQUEST THE SECOND PAGE', () => {
      it('C2) allObj should contain 20 objects', async () => {
        await store.dispatch(
          fetchBookingsAndPrivateBookings({
            member: 1,
            date_start: moment().format('YYYY-MM-DD'),
          }),
        );

        const { bookingAndPrivateBooking } = store.getState().consumer;
        expect(bookingAndPrivateBooking.allObj.length).toBe(20);
      });

      it('C2) allObj should be sorted by date', () => {
        const { bookingAndPrivateBooking } = store.getState().consumer;
        bookingAndPrivateBooking.allObj.forEach((obj, i) => {
          expect(obj.type).toBe(DATA_SET_3.all[i][1]);
          expect(obj[obj.type]).toBe(DATA_SET_3.all[i][0].id);
        });
      });
    });
  });
});
