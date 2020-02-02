import Immutable from 'seamless-immutable/seamless-immutable.production.min';

import authActionTypes from '../../actions/auth.types';
import { actionTypes as paymentPackActionTypes } from '../payment-packs/types';
import {
  actionTypes,
  memberListActions,
  barcodeRetrieveAction,
} from './actions';

const initialState = Immutable({
  loading: false,
  all: [], // all the members
  member: {}, // currently shown member
  error: null,
  barcode: {
    data: null,
    loading: false,
    error: null,
  },
  search: {
    items: [],
    loading: false,
    error: null,
  },
  upsert: {
    loading: false,
    error: null,
  },
  history: [],
});

export default function memberReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case memberListActions.success.toString(): {
      return state.set('all', action.payload);
    }
    case memberListActions.error.toString(): {
      return state.set('error', action.payload);
    }
    case memberListActions.isLoading.toString(): {
      return state.set('loading', action.payload);
    }

    case barcodeRetrieveAction.success.toString(): {
      return state.setIn(['barcode', 'data'], action.payload);
    }
    case barcodeRetrieveAction.reset.toString(): {
      return state
        .setIn(['barcode', 'data'], null)
        .setIn(['barcode', 'loading'], false);
    }
    case barcodeRetrieveAction.error.toString(): {
      return state.setIn(['barcode', 'error'], action.payload);
    }
    case barcodeRetrieveAction.isLoading.toString(): {
      return state.setIn(['barcode', 'loading'], action.payload);
    }

    case actionTypes.MEMBER_TAG_SUCCESS: {
      let newState = state;
      if (state.member.id === action.member.id) {
        newState = newState.setIn(['member', 'tags'], action.member.tags);
      }
      let idx = newState.all.findIndex((m) => m.id === action.member.id);
      if (idx === -1) {
        idx = newState.all.length;
      }
      return newState.setIn(['all', idx], action.member);
    }
    case actionTypes.MEMBER_SEARCH_START: {
      return state
        .setIn(['search', 'items'], [])
        .setIn(['search', 'loading'], true);
    }
    case actionTypes.MEMBER_MERGE_SUCCESS: {
      return state
        .setIn(
          ['search', 'items'],
          state.search.items.filter((m) => m.id !== action.src),
        )
        .set('all', state.all.filter((m) => m.id !== action.src))
        .set('member', state.member.id === action.src ? {} : state.member);
    }
    case actionTypes.MEMBER_SEARCH_ERROR: {
      return state
        .setIn(['search', 'error'], action.error)
        .setIn(['search', 'loading'], false);
    }
    case actionTypes.MEMBER_SEARCH_SUCCESS: {
      return state
        .setIn(['search', 'items'], action.members)
        .setIn(['search', 'loading'], false);
    }

    case actionTypes.START_FETCH_MEMBER:
      return state.set('loading', true);
    case actionTypes.ERROR_FETCHING_MEMBER:
      return state.set('loading', false);
    case actionTypes.HAS_FETCHED_MEMBER: {
      const { member } = action;
      let idx = state.all.findIndex((m) => m.id === member.id);
      if (idx === -1) {
        idx = state.all.length;
      }
      return state
        .set('member', member)
        .set('loading', false)
        .setIn(['all', idx], member)
        .set('history', [
          member,
          ...state.history.filter((m) => m.id !== member.id).slice(0, 10),
        ]);
    }

    case actionTypes.MEMBER_UPSERT_LOADING:
      return state.set('upsert', { loading: true, error: null });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS:
      return state.set('upsert', { error: null, loading: false });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR:
      return state.set('upsert', { error: action.error, loading: false });

    case actionTypes.MEMBER_UPDATE:
      return state.set('updatedCoach', action.member);

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
      return state.set('error', action.error);

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_START:
      return state;

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS: {
      if (state.member.id === action.note.member) {
        return state.set('member', {
          ...state.member,
          notes: [
            action.note,
            ...state.member.notes.filter((n) => n.id !== action.note.id),
          ],
        });
      }
      return state;
    }
    case actionTypes.MEMBER_NOTE_DELETE_SUCCESS: {
      if (state.member.id === action.memberId) {
        return state.setIn(
          ['member', 'notes'],
          state.member.notes.filter((n) => n.id !== action.noteId),
        );
      }
      return state;
    }

    case actionTypes.MEMBER_ADD_FILE_LOADING:
      return state.setIn(['upsert', ' loading'], action.loading);

    case actionTypes.MEMBER_ADD_FILE_ERROR:
      return state.setIn(['upsert', ' error'], action.error);

    case actionTypes.MEMBER_ADD_FILE_SUCCESS: {
      if (state.member.id === action.response.member) {
        return state.set('member', {
          ...state.member,
          files: [action.response, ...state.member.files],
        });
      }
      return state;
    }

    case actionTypes.MEMBER_REMOVE_FILE_LOADING:
      return state.setIn(['upsert', ' loading'], action.loading);

    case actionTypes.MEMBER_REMOVE_FILE_ERROR:
      return state.setIn(['upsert', ' error'], action.error);

    case actionTypes.MEMBER_REMOVE_FILE_SUCCESS: {
      if (state.member.id === action.response.memberId) {
        return state.setIn(
          ['member', 'files'],
          state.member.files.filter((n) => n.id !== action.response.fileId),
        );
      }
      return state;
    }

    default:
      return state;
  }
}
