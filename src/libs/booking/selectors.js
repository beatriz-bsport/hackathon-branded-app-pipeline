// @flow
import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const getState = (state: State) => state.booking;

const getBookings = (state: State) => getState(state).all;

const getByConsumerPack = (state: State, id: number) =>
  getBookings(state).filter(
    (booking) => parseInt(booking.consumer_payment_pack_id, 10) === id,
  );

const getOptions = (state: State) => getState(state).options;
const getOptionsPending = createSelector(
  getOptions,
  (options) => options.filter((o) => !o.cancelled && !o.booking),
);

export default {
  getState,
  getBookings,
  getOptions,
  getOptionsPending,
  getByConsumerPack,
};
