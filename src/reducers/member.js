import Immutable from 'seamless-immutable';

import actionTypes from '../actions/member.types';

const initialState = Immutable({
  loading: true,
  all: [], // all the members
  member: {}, // currently showed member
  // Create or Update
  createOrUpdatePending: false,
  createOrUpdateError: null,
});

export default function memberReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_MEMBERS: {
      const all = action.members;
      return Immutable.merge(state, {
        all,
        loading: false,
      });
    }

    case actionTypes.START_FETCH_MEMBERS: {
      return Immutable.merge(state, {
        loading: true,
      });
    }
    case actionTypes.ERROR_FETCHING_MEMBERS: {
      return Immutable.merge(state, {
        loading: false,
      });
    }
    case actionTypes.START_FETCH_MEMBER:
      return Immutable.merge(state, {
        loading: true,
      });
    case actionTypes.ERROR_FETCHING_MEMBER:
      return Immutable.merge(state, {
        loading: false,
      });
    case actionTypes.HAS_FETCHED_MEMBER: {
      const { member } = action;
      return Immutable.merge(state, {
        member,
        loading: false,
      });
    }

    case actionTypes.MEMBER_CREATE_OR_UPDATE:
      return state.merge({
        createOrUpdatePending: true,
      });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS:
      return state.merge({
        createOrUpdatePending: false,
      });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR:
      return state.merge({
        createOrUpdateError: action.error,
        createOrUpdatePending: false,
      });

    case actionTypes.MEMBER_UPDATE:
      return state.merge({
        updatedCoach: action.member,
      });

    default:
      return state;
  }
}
