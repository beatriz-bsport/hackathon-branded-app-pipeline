import Immutable from 'seamless-immutable';

import actionTypes from '../actions/member.types';
import authActionTypes from '../actions/auth.types';
import paymentPackActionTypes from '../actions/paymentPack.types';

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
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.HAS_FETCHED_MEMBERS: {
      const all = action.members;
      return Immutable.merge(state, {
        all,
        loading: false,
        createOrUpdatePending: false,
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
        createOrUpdatePending: false,
      });
    case actionTypes.ERROR_FETCHING_MEMBER:
      return Immutable.merge(state, {
        loading: false,
        createOrUpdatePending: false,
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

    case paymentPackActionTypes.UPDATE_CONSUMER_PACK_CREDIT_DONE: {
      const paymentPacks =
        (state.member && state.member.consumer_payment_pack) || [];
      const paymentPackIdx = paymentPacks.findIndex(
        (p) => p.id === action.consumerPackId,
      );
      if (paymentPackIdx === -1) {
        return state;
      }

      const p = paymentPacks[paymentPackIdx];
      const path = ['member', 'consumer_payment_pack', paymentPackIdx];
      return state
        .setIn(path.concat(['used_credits']), p.used_credits - action.nbCredit)
        .setIn(
          path.concat(['available_credits']),
          p.available_credits + action.nbCredit,
        );
    }

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_ERROR:
    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_START:
      return state;

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS: {
      if (state.member.id === action.note.member) {
        return state.merge({
          member: {
            ...state.member,
            notes: [
              action.note,
              ...state.member.notes.filter((n) => n.id !== action.note.id),
            ],
          },
        });
      }
      return state;
    }
    case actionTypes.MEMBER_NOTE_DELETE_SUCCESS: {
      if (state.member.id === action.memberId) {
        return state.merge({
          member: {
            ...state.member,
            notes: state.member.notes.filter((n) => n.id !== action.noteId),
          },
        });
      }
      return state;
    }

    default:
      return state;
  }
}
