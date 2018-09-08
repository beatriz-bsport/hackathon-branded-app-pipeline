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

export function fetchMember(id) {
  return async (dispatch) => {
    dispatch(startFetchMember());

    try {
      const response = await api.member.fetchMember(id);
      const member = response.data;
      dispatch(hasFetchedMember(member));
    } catch (err) {
      dispatch(errorFetchingMember());
    }
  };
}

export function startFetchMember() {
  return { type: types.START_FETCH_MEMBER };
}

export function hasFetchedMember(member) {
  return { type: types.HAS_FETCHED_MEMBER, member };
}

export function errorFetchingMember() {
  return { type: types.ERROR_FETCHING_MEMBER };
}
