import api from '../api';
import types from './member.types';

export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchMembers());

    try {
      const response = await api.member.fetchAll();
      const members = response.data;

      dispatch(fetchedMembers(members));
    } catch (err) {
      dispatch(errorFetchingMembers());
    }
  };
}

export function fetchedMembers(members) {
  return { type: types.HAS_FETCHED_MEMBERS, members };
}
export function startFetchMembers() {
  return { type: types.START_FETCH_MEMBERS };
}

export function errorFetchingMembers() {
  return { type: types.ERROR_FETCHING_MEMBERS };
}

export function fetchBookings(memberId) {
  return async (dispatch) => {
    const response = await api.member.fetchBookings(memberId);
    const bookings = response.data;

    dispatch(hasFetchedMemberBookings(bookings));
  };
}

export function hasFetchedMemberBookings(bookings) {
  return { type: types.HAS_FETCHED_MEMBER_BOOKINGS, bookings };
}
