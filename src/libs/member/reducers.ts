import Immutable from 'seamless-immutable';

// @ts-ignore
import { handleActions } from 'redux-actions';
import authActionTypes from '../../actions/auth.types';

import {
  actionTypes,
  memberListActions,
  barcodeRetrieveAction,
  memberBulkActions,
  memberCountObject,
  memberListPaginatedActions,
  fetchMyUserProfileActions,
  membersListWithTagRepo,
  membersListWithoutTagRepo,
  tagAllMemberRepo,
  untagAllMemberRepo,
} from './actions';
import { Member, MemberNote, MemberState } from './types';
import { GenericListReducer, GenericReducer } from '../../utils/reduxHelper';
import { GenericPaginationResults } from '../types';

const initialState: Immutable.Immutable<MemberState> = Immutable<MemberState>({
  loading: false,
  error: null,
  allIds: [], // all the members
  detailData: {},
  listData: {},
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
  count: {
    loading: false,
    error: null,
    data: null,
  },
  historyListIds: [],
  byId: {},
  communication: {
    loading: false,
    error: null,
    allPageIds: [],
    allIdsWithoutPhone: [],
    allIdsWithoutEmail: [],
    allIds: [],
    page: 1,
  },
  userProfile: {
    loading: true,
    error: null,
    profile: null,
  },
  generic: {
    ...membersListWithTagRepo.initialState,
    ...membersListWithoutTagRepo.initialState,
    ...tagAllMemberRepo.initialState,
    ...untagAllMemberRepo.initialState,
  },
});

export default handleActions<Immutable.Immutable<MemberState>>(
  {
    [authActionTypes.DISCONNECT]: () => {
      return initialState;
    },
    [memberBulkActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['bulk', 'loading'], action.payload);
    },
    [memberBulkActions.error.toString()]: (state, action) => {
      return state.setIn(['bulk', 'error'], action.payload);
    },
    [memberBulkActions.success.toString()]: (state, action) => {
      return state
        .merge(
          {
            listData: action.payload.reduce(
              (acc: MemberState['listData'], m: Member) => {
                acc[m.id] = m;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          // @ts-ignore
          [...state.allIds, ...action.payload.map((m: Member) => m.id)],
        );
    },
    [memberListActions.success.toString()]: (
      state,
      action: { payload: GenericPaginationResults<Member> },
    ) => {
      return state
        .set('listCount', action.payload.count)
        .merge(
          {
            listData: action.payload.results.reduce(
              (acc: MemberState['listData'], m: Member) => {
                acc[m.id] = m;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          action.payload.results.map((m: Member) => m.id),
        );
    },
    [memberListActions.error.toString()]: (state, action) => {
      return state.set('error', action.payload);
    },
    [memberListActions.isLoading.toString()]: (state, action) => {
      return state.set('loading', action.payload);
    },
    [memberListPaginatedActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['communication', 'loading'], action.payload);
    },
    [memberListPaginatedActions.error.toString()]: (state, action) => {
      return state.setIn(['communication', 'error'], action.payload);
    },
    [memberListPaginatedActions.success.toString()]: (state, action) => {
      return state
        .setIn(['communication', 'page'], action.payload.page)
        .setIn(['communication', 'allIds'], action.payload.allIds)

        .setIn(
          ['communication', 'allIdsWithoutPhone'],
          action.payload.allIdsWithoutPhone,
        )
        .setIn(
          ['communication', 'allIdsWithoutEmail'],
          action.payload.allIdsWithoutEmail,
        )

        .setIn(
          ['communication', 'allPageIds'],
          action.payload.results.map((member: Member) => member.id),
        )
        .merge(
          {
            byId: action.payload.results.reduce(
              (acc: MemberState['byId'], m: Member) => {
                acc[m.id] = m;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },
    [memberCountObject.success.toString()]: (state, action) => {
      return state.setIn(['count', 'data'], action.payload);
    },

    [memberCountObject.isLoading.toString()]: (state, action) => {
      return state.setIn(['count', 'loading'], action.payload);
    },

    [memberCountObject.error.toString()]: (state, action) => {
      return state.setIn(['count', 'error'], action.payload);
    },

    [barcodeRetrieveAction.success.toString()]: (state, action) => {
      return state.setIn(['barcode', 'data'], action.payload);
    },
    [barcodeRetrieveAction.reset.toString()]: (state) => {
      return state
        .setIn(['barcode', 'data'], null)
        .setIn(['barcode', 'loading'], false);
    },
    [barcodeRetrieveAction.error.toString()]: (state, action) => {
      return state.setIn(['barcode', 'error'], action.payload);
    },
    [barcodeRetrieveAction.isLoading.toString()]: (state, action) => {
      return state.setIn(['barcode', 'loading'], action.payload);
    },
    [actionTypes.MEMBER_TAG_SUCCESS.toString()]: (state, action) => {
      return state.setIn(
        ['detailData', action.member.id, 'tags'],
        action.member.tags,
      );
    },
    [actionTypes.MEMBER_SEARCH_START.toString()]: (state) => {
      return state
        .setIn(['search', 'allIds'], [])
        .setIn(['search', 'loading'], true);
    },
    [actionTypes.MEMBER_MERGE_SUCCESS.toString()]: (state, action) => {
      return state
        .setIn(
          ['search', 'allIds'],
          state.search.allIds.filter((m) => m.id !== action.src),
        )
        .set(
          'allIds',
          state.allIds.filter((m) => m.id !== action.src),
        );
    },
    [actionTypes.MEMBER_SEARCH_ERROR.toString()]: (state, action) => {
      return state
        .setIn(['search', 'error'], action.error)
        .setIn(['search', 'loading'], false);
    },
    [actionTypes.MEMBER_SEARCH_SUCCESS.toString()]: (state, action) => {
      return state
        .setIn(
          ['search', 'allIds'],
          action.members.map((m: Member) => m.id),
        )
        .setIn(['search', 'loading'], false)
        .merge(
          {
            listData: action.members.reduce(
              (acc: MemberState['byId'], m: Member) => {
                acc[m.id] = m;
                return acc;
              },
              {},
            ),
          },
          { deep: true },
        );
    },

    [actionTypes.START_FETCH_MEMBER.toString()]: (state) => {
      return state.set('loading', true);
    },
    [actionTypes.ERROR_FETCHING_MEMBER.toString()]: (state) => {
      return state.set('loading', false);
    },
    [actionTypes.HAS_FETCHED_MEMBER.toString()]: (state, action) => {
      const { member } = action;
      return state
        .set('member', member.id)
        .setIn(['detailData', member.id], member)
        .set('loading', false)
        .set('historyListIds', [
          member.id,
          // @ts-ignore
          ...state.historyListIds.filter((m) => m !== member.id).slice(0, 10),
        ]);
    },
    [actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS.toString()]: (state) => {
      return state.set('upsert', { error: null, loading: false });
    },
    [actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR.toString()]: (state, action) => {
      return state.set('upsert', { error: action.error, loading: false });
    },

    [actionTypes.MEMBER_NOTE_CREATEORUPDATE_ERROR.toString()]: (
      state,
      action,
    ) => {
      return state.set('error', action.error);
    },
    [actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(
        ['detailData', action.note.member, 'notes'],
        [
          action.note,
          ...// @ts-ignore
          (state.detailData[action.note.member] || { notes: [] }).notes.filter(
            (n: MemberNote) => n.id !== action.note.id,
          ),
        ],
      );
    },
    [actionTypes.MEMBER_NOTE_DELETE_SUCCESS.toString()]: (state, action) => {
      // @ts-ignore
      if (state.detailData[action.memberId]) {
        return state.setIn(
          ['detailData', action.memberId, 'notes'],
          // @ts-ignore
          state.detailData[action.memberId].notes.filter(
            (n: MemberNote) => n.id !== action.noteId,
          ),
        );
      }
      return state;
    },

    [actionTypes.MEMBER_ADD_FILE_LOADING.toString()]: (state, action) => {
      return state.setIn(['upsert', ' loading'], action.loading);
    },

    [actionTypes.MEMBER_ADD_FILE_ERROR.toString()]: (state, action) => {
      return state.setIn(['upsert', ' error'], action.error);
    },

    [actionTypes.MEMBER_ADD_FILE_SUCCESS.toString()]: (state, action) => {
      // @ts-ignore
      if (state.detailData[action.response.member]) {
        return state.setIn(
          ['detailData', action.response.member, 'files'],
          // @ts-ignore
          [action.response, ...state.detailData[action.response.member].files],
        );
      }
      return state;
    },

    [actionTypes.MEMBER_REMOVE_FILE_LOADING.toString()]: (state, action) => {
      return state.setIn(['upsert', ' loading'], action.loading);
    },

    [actionTypes.MEMBER_REMOVE_FILE_ERROR.toString()]: (state, action) => {
      return state.setIn(['upsert', ' error'], action.error);
    },
    [actionTypes.MEMBER_REMOVE_FILE_SUCCESS.toString()]: (state, action) => {
      // @ts-ignore
      if (state.detailData[action.response.memberId]) {
        return state.setIn(
          ['detailData', action.response.memberId, 'files'],
          // @ts-ignore
          state.detailData[action.response.memberId].files.filter(
            (n: any) => n.id !== action.response.fileId,
          ),
        );
      }
      return state;
    },
    [fetchMyUserProfileActions.error.toString()]: (state, action) => {
      return state.setIn(['userProfile', 'error'], action.payload);
    },
    [fetchMyUserProfileActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['userProfile', 'loading'], action.payload);
    },
    [fetchMyUserProfileActions.success.toString()]: (state, action) => {
      return state.setIn(['userProfile', 'profile'], action.payload);
    },
    ...GenericListReducer(membersListWithTagRepo),
    ...GenericListReducer(membersListWithoutTagRepo),
    ...GenericReducer(tagAllMemberRepo),
    ...GenericReducer(untagAllMemberRepo),
  },
  initialState,
);
