import Immutable from 'seamless-immutable/seamless-immutable.production.min';

import authActionTypes from '../../actions/auth.types';
import {
  actionTypes,
  memberListActions,
  barcodeRetrieveAction,
  memberBulkActions,
} from './actions';

const initialState = Immutable({
  loading: false,
  allIds: [], // all the members
  detailData: {},
  listData: {},
  memberId: null, // currently shown member
  error: null,
  barcode: {
    data: null,
    loading: false,
    error: null,
  },
  search: {
    allIds: [],
    loading: false,
    error: null,
  },
  upsert: {
    loading: false,
    error: null,
  },
  bulk: {
    loading: false,
    error: null,
  },
  historyListIds: [],
});

export default function memberReducers(state = initialState, action = {}) {
  switch (action.type) {
    case authActionTypes.DISCONNECT:
      return initialState;
    case memberBulkActions.isLoading.toString(): {
      return state.setIn(['bulk', 'loading'], action.payload);
    }
    case memberBulkActions.error.toString(): {
      return state.setIn(['bulk', 'error'], action.payload);
    }
    case memberBulkActions.success.toString(): {
      return state
        .merge(
          {
            listData: action.payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          [...state.allIds, ...action.payload.map((m) => m.id)],
        );
    }
    case memberListActions.success.toString(): {
      return state
        .merge(
          {
            listData: action.payload.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(['allIds'], action.payload.map((m) => m.id));
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
      return state.setIn(
        ['detailData', action.member.id, 'tags'],
        action.member.tags,
      );
    }
    case actionTypes.MEMBER_SEARCH_START: {
      return state
        .setIn(['search', 'allIds'], [])
        .setIn(['search', 'loading'], true);
    }
    case actionTypes.MEMBER_MERGE_SUCCESS: {
      return state
        .setIn(
          ['search', 'allIds'],
          state.search.allIds.filter((m) => m.id !== action.src),
        )
        .set('allIds', state.allIds.filter((m) => m.id !== action.src));
    }
    case actionTypes.MEMBER_SEARCH_ERROR: {
      return state
        .setIn(['search', 'error'], action.error)
        .setIn(['search', 'loading'], false);
    }
    case actionTypes.MEMBER_SEARCH_SUCCESS: {
      return state
        .setIn(['search', 'allIds'], action.members.map((m) => m.id))
        .setIn(['search', 'loading'], false)
        .merge(
          {
            listData: action.members.reduce((acc, ps) => {
              acc[ps.id] = ps;
              return acc;
            }, {}),
          },
          { deep: true },
        );
    }

    case actionTypes.START_FETCH_MEMBER:
      return state.set('loading', true);
    case actionTypes.ERROR_FETCHING_MEMBER:
      return state.set('loading', false);
    case actionTypes.HAS_FETCHED_MEMBER: {
      const { member } = action;
      return state
        .set('member', member.id)
        .setIn(['detailData', member.id], member)
        .set('loading', false)
        .set('historyListIds', [
          member.id,
          ...state.historyListIds.filter((m) => m !== member.id).slice(0, 10),
        ]);
    }

    case actionTypes.MEMBER_UPSERT_LOADING:
      return state.set('upsert', { loading: true, error: null });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS:
      return state.set('upsert', { error: null, loading: false });

    case actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR:
      return state.set('upsert', { error: action.error, loading: false });

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_ERROR:
      return state.set('error', action.error);

    case actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS: {
      return state.setIn(
        ['detailData', action.note.member, 'notes'],
        [
          action.note,
          [
            ...(
              state.detailData[action.note.member] || { notes: [] }
            ).notes.filter((n) => n.id !== action.note.id),
          ],
        ],
      );
    }
    case actionTypes.MEMBER_NOTE_DELETE_SUCCESS: {
      if (state.detailData[action.memberId]) {
        return state.setIn(
          ['detailData', 'notes'],
          state.detailData.notes.filter((n) => n.id !== action.noteId),
        );
      }
      return state;
    }

    case actionTypes.MEMBER_ADD_FILE_LOADING:
      return state.setIn(['upsert', ' loading'], action.loading);

    case actionTypes.MEMBER_ADD_FILE_ERROR:
      return state.setIn(['upsert', ' error'], action.error);

    case actionTypes.MEMBER_ADD_FILE_SUCCESS: {
      if (state.detailData[action.response.member]) {
        return state.setIn(
          ['detailData', action.response.member, 'files'],
          [action.response, ...state.detailData[action.response.member].files],
        );
      }
      return state;
    }

    case actionTypes.MEMBER_REMOVE_FILE_LOADING:
      return state.setIn(['upsert', ' loading'], action.loading);

    case actionTypes.MEMBER_REMOVE_FILE_ERROR:
      return state.setIn(['upsert', ' error'], action.error);

    case actionTypes.MEMBER_REMOVE_FILE_SUCCESS: {
      if (state.detailData[action.response.memberId]) {
        return state.setIn(
          ['detailData', action.response.memberId, 'files'],
          state.detailData[action.response.memberId].files.filter(
            (n) => n.id !== action.response.fileId,
          ),
        );
      }
      return state;
    }

    default:
      return state;
  }
}
