import Immutable from 'seamless-immutable';

import actionTypes from '../actions/member.types';
import authActionTypes from '../actions/auth.types';
import paymentPackActionTypes from '../actions/paymentPack.types';
import { listMemberReducers } from '../actions/member.actions';

const initialState = Immutable({
  loading: true,
  all: [], // all the members
  quickFetched: [],
  member: {}, // currently shown member
  byOffer: {
    items: [],
    loading: false,
  },
  upsert: {
    loading: false,
    error: null,
  },
});

export default function(state = initialState, action = {}) {
  return listMemberReducers(memberReducers(state, action), action);
}

function memberReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;

    case actionTypes.HAS_FETCHED_MEMBERS: {
      const all = action.members;
      return Immutable.merge(state, {
        all,
        loading: false,
      });
    }
    case actionTypes.START_FETCH_MEMBER_BY_OFFER: {
      return state
        .setIn(['byOffer', 'loading'], true)
        .setIn(['byOffer', 'items'], []);
    }
    case actionTypes.ERROR_FETCH_MEMBER_BY_OFFER: {
      return state.setIn(['byOffer', 'loading'], false);
    }
    case actionTypes.SUCCESS_FETCH_MEMBER_BY_OFFER: {
      return state
        .setIn(['byOffer', 'items'], action.members)
        .set('loading', false);
    }

    case actionTypes.SUCCESS_QUICK_FETCH_MEMBER: {
      const { member } = action;
      return Immutable.merge(state, {
        all: [member, ...state.all.filter((m) => m.id !== member.id)],
        quickFetched: [
          member,
          ...state.quickFetched.filter((m) => m.id !== member.id),
        ],
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

    case actionTypes.MEMBER_UPSERT_LOADING:
      return state.merge({
        upsert: { loading: true, error: null },
      });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS:
      return state.merge({
        upsert: { error: null, loading: false },
      });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR:
      return state.merge({
        upsert: { error: action.error, loading: false },
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
