// @flow
import type { State } from '../../state/types';

const getState = (state: State) => state.booking;

const getBookings = (state: State) => getState(state).all;
const getByConsumerPack = (state: State, id: number) =>
  getBookings(state).filter(
    (booking) => parseInt(booking.consumer_payment_pack_id, 10) === id,
  );

const getOptions = (state: State) => getState(state).options;

export default { getState, getBookings, getOptions, getByConsumerPack };
