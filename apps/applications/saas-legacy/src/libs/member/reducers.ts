import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';

import { handleActions } from 'redux-actions';
import { authActionTypes } from '#src/actions/constants';

import {
  actionTypes,
  memberListActions,
  barcodeRetrieveAction,
  memberBulkActions,
  memberCountObject,
  memberListForCommunicationActions,
  fetchMyUserProfileActions,
  membersListWithTagRepo,
  membersListWithoutTagRepo,
  tagAllMemberRepo,
  untagAllMemberRepo,
  archiveMemberActions,
  unArchiveMemberActions,
  interrogateMemberStatusActions,
  searchArchivedMembers,
  incrementalSearchAction,
  updateMemberFileActions,
  createChangeEmailRequestActions,
  retrieveChangeEmailRequestActions,
  retrieveMinimalChangeEmailRequestActions,
  retrieveMemberPendingEmailRequestActions,
  updateSpiviPrivacySettingsActions,
  updateDefaultEstablishmentBillingGroupActions,
  uploadLeadManagementFileActions,
} from './actions';
import { Member, MemberNote, MemberState } from './types';
import {
  GenericListReducer,
  GenericReducer,
  prepareCacheKeys,
} from '../../utils/reduxHelper';
import { GenericPaginationResults } from '../types';

const initialState: Immutable.Immutable<MemberState> = Immutable<MemberState>({
  loading: false,
  error: null,
  cachedIds: {},
  allIds: [], // all the members
  listCount: 0,
  quickFetched: [],
  byOffer: {
    loading: false,
    items: [],
  },
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
    archived: {
      loading: false,
      error: null,
      allIds: [],
      data: {},
    },
    incremental: {
      loading: false,
      error: null,
      allIds: [],
      nextPage: 1,
    },
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
    allIdsWithoutEmail: [],
    allIdsWithoutPhone: [],
    countWithPhone: null,
    countTotal: null,
    countWithEmail: null,
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
  archive: {
    error: null,
    loading: false,
    interrogate: {
      byId: {},
    },
  },
  change_email_request: {
    error: null,
    loading: false,
    current: null,
    minimal: null,
  },
  spivi_privacy_settings: {
    error: null,
    loading: false,
  },
  // @ts-expect-error
  updateDefaultEstablishmentBillingGroup: {
    error: null,
    loading: false,
  },
  leadManagementUpload: {
    error: null,
    loading: false,
  },
});

export default handleActions<Immutable.Immutable<MemberState>, any>(
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
        .merge(
          {
            cachedIds: prepareCacheKeys(action.payload),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
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
    [memberListForCommunicationActions.isLoading.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(['communication', 'loading'], action.payload);
    },
    [memberListForCommunicationActions.error.toString()]: (state, action) => {
      return state.setIn(['communication', 'error'], action.payload);
    },
    [memberListForCommunicationActions.success.toString()]: (state, action) => {
      return state
        .setIn(['communication', 'page'], action.payload.page)
        .setIn(['communication', 'allIds'], action.payload.allIds)
        .setIn(
          ['communication', 'countWithPhone'],
          action.payload.count_with_phone,
        )
        .setIn(
          ['communication', 'allIdsWithoutPhone'],
          action.payload.allIdsWithoutPhone,
        )
        .setIn(['communication', 'countTotal'], action.payload.count)
        .setIn(
          ['communication', 'countWithEmail'],
          action.payload.count_with_email,
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
    [memberListForCommunicationActions.reset.toString()]: (state) => {
      return state
        .setIn(['communication', 'page'], 1)
        .setIn(['communication', 'allPageIds'], [])
        .setIn(['communication', 'countTotal'], 0)
        .setIn(['communication', 'countWithEmail'], 0)
        .setIn(['communication', 'countWithPhone'], 0);
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
        // @ts-expect-error
        ['detailData', action.member.id, 'tags'],
        // @ts-expect-error
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
          // @ts-expect-error
          state.search.allIds.filter((m) => m.id !== action.src),
        )
        .set(
          'allIds',
          // @ts-expect-error
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
          // @ts-expect-error
          action.members.map((m: Member) => m.id),
        )
        .setIn(['search', 'loading'], false)
        .merge(
          {
            // @ts-expect-error
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
    [searchArchivedMembers.isLoading.toString()]: (state) => {
      return state.setIn(['search', 'archived', 'loading'], false);
    },
    [searchArchivedMembers.error.toString()]: (state, action) => {
      return state.setIn(['search', 'archived', 'error'], action.error);
    },
    [searchArchivedMembers.success.toString()]: (state, action) => {
      return state
        .setIn(
          ['search', 'archived', 'allIds'],
          action.payload?.map((m: Member) => m.id) || [],
        )
        .setIn(['search', 'archived', 'loading'], false)
        .merge(
          {
            search: {
              archived: {
                data: action.payload?.reduce(
                  (acc: MemberState['byId'], m: Member) => {
                    acc[m.id] = m;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
    [incrementalSearchAction.reset.toString()]: (state) => {
      return state.setIn(['search', 'incremental', 'allIds'], []);
    },
    [incrementalSearchAction.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'incremental', 'loading'], payload);
    },
    [incrementalSearchAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'incremental', 'error'], payload);
    },
    [incrementalSearchAction.success.toString()]: (state, action) => {
      return state
        .setIn(
          ['search', 'incremental', 'allIds'],
          uniq([
            ...state.search.incremental.allIds,
            ...action.payload.results.map((m: Member) => m.id),
          ]),
        )
        .setIn(['search', 'incremental', 'nextPage'], action.payload.next_page)
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

    [actionTypes.START_FETCH_MEMBER.toString()]: (state) => {
      return state.set('loading', true);
    },
    [actionTypes.ERROR_FETCHING_MEMBER.toString()]: (state) => {
      return state.set('loading', false);
    },
    [actionTypes.HAS_FETCHED_MEMBER.toString()]: (state, action) => {
      // @ts-expect-error
      const member = action?.member ?? action?.payload;

      if (!member) return state;

      return state
        .set('member', member.id)
        .setIn(['detailData', member.id], member)
        .set('loading', false)
        .set('historyListIds', [
          member.id,
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
        // @ts-expect-error
        ['detailData', action.note.member, 'notes'],
        [
          // @ts-expect-error
          action.note,
          ...// @ts-expect-error
          (state.detailData[action.note.member] || { notes: [] }).notes.filter(
            // @ts-expect-error
            (n: MemberNote) => n.id !== action.note.id,
          ),
        ],
      );
    },
    [actionTypes.MEMBER_NOTE_DELETE_SUCCESS.toString()]: (state, action) => {
      // @ts-expect-error
      if (state.detailData[action.memberId]) {
        return state.setIn(
          // @ts-expect-error
          ['detailData', action.memberId, 'notes'],
          // @ts-expect-error
          state.detailData[action.memberId].notes.filter(
            // @ts-expect-error
            (n: MemberNote) => n.id !== action.noteId,
          ),
        );
      }
      return state;
    },

    [actionTypes.MEMBER_ADD_FILE_LOADING.toString()]: (state, action) => {
      // @ts-expect-error
      return state.setIn(['upsert', ' loading'], action.loading);
    },

    [actionTypes.MEMBER_ADD_FILE_ERROR.toString()]: (state, action) => {
      return state.setIn(['upsert', ' error'], action.error);
    },

    [actionTypes.MEMBER_ADD_FILE_SUCCESS.toString()]: (state, action) => {
      // @ts-expect-error
      if (state.detailData[action.response.member]) {
        return state.setIn(
          // @ts-expect-error
          ['detailData', action.response.member, 'files'],
          // @ts-expect-error
          [action.response, ...state.detailData[action.response.member].files],
        );
      }
      return state;
    },

    [updateMemberFileActions.success.toString()]: (state, { payload }) => {
      if (state?.detailData?.[payload.member]?.files) {
        const newFiles = state.detailData[payload.member].files?.map((file) => {
          if (file.id === payload.id) {
            return payload;
          }
          return file;
        });

        return state.setIn(['detailData', payload.member, 'files'], newFiles);
      }
      return state;
    },

    [actionTypes.MEMBER_REMOVE_FILE_LOADING.toString()]: (state, action) => {
      // @ts-expect-error
      return state.setIn(['upsert', ' loading'], action.loading);
    },

    [actionTypes.MEMBER_REMOVE_FILE_ERROR.toString()]: (state, action) => {
      return state.setIn(['upsert', ' error'], action.error);
    },
    [actionTypes.MEMBER_REMOVE_FILE_SUCCESS.toString()]: (state, action) => {
      // @ts-expect-error
      if (state.detailData[action.response.memberId]) {
        return state.setIn(
          // @ts-expect-error
          ['detailData', action.response.memberId, 'files'],
          // @ts-expect-error
          state.detailData[action.response.memberId].files.filter(
            // @ts-expect-error
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
    [archiveMemberActions.error.toString()]: (state, action) => {
      return state.setIn(['archive', 'error'], action.payload);
    },
    [archiveMemberActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['archive', 'loading'], action.payload);
    },
    [unArchiveMemberActions.error.toString()]: (state, action) => {
      return state.setIn(['archive', 'error'], action.payload);
    },
    [unArchiveMemberActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['archive', 'loading'], action.payload);
    },
    [interrogateMemberStatusActions.error.toString()]: (state, action) => {
      return state.setIn(['archive', 'error'], action.payload);
    },
    [interrogateMemberStatusActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['archive', 'loading'], action.payload);
    },
    [interrogateMemberStatusActions.success.toString()]: (state, action) => {
      return state.merge(
        {
          archive: {
            interrogate: {
              byId: { [action.payload.memberId]: action.payload.data },
            },
          },
        },
        { deep: true },
      );
    },
    [createChangeEmailRequestActions.isLoading.toString()]: (state, action) => {
      return state.setIn(['change_email_request', 'loading'], action.payload);
    },
    [createChangeEmailRequestActions.error.toString()]: (state, action) => {
      return state.setIn(['change_email_request', 'error'], action.payload);
    },
    [retrieveChangeEmailRequestActions.isLoading.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(['change_email_request', 'loading'], action.payload);
    },
    [retrieveChangeEmailRequestActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['change_email_request', 'error'], payload);
    },
    [retrieveChangeEmailRequestActions.success.toString()]: (state, action) => {
      return state.merge(
        {
          change_email_request: {
            current: action.payload,
          },
        },
        { deep: true },
      );
    },
    [retrieveMinimalChangeEmailRequestActions.isLoading.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(['change_email_request', 'loading'], action.payload);
    },
    [retrieveMinimalChangeEmailRequestActions.success.toString()]: (
      state,
      action,
    ) => {
      return state.merge(
        {
          change_email_request: {
            minimal: action.payload,
          },
        },
        { deep: true },
      );
    },
    [retrieveMemberPendingEmailRequestActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (state?.detailData?.[payload.memberId]) {
        return state.setIn(
          ['detailData', payload.memberId, 'pending_email'],
          payload.data,
        );
      }
      return state;
    },
    [updateSpiviPrivacySettingsActions.isLoading.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(['spivi_privacy_settings', 'loading'], action.payload);
    },
    [updateSpiviPrivacySettingsActions.error.toString()]: (state, action) => {
      return state.setIn(['spivi_privacy_settings', 'error'], action.payload);
    },
    [updateDefaultEstablishmentBillingGroupActions.error.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(
        ['updateDefaultEstablishmentBillingGroup', 'error'],
        action.payload,
      );
    },
    [updateDefaultEstablishmentBillingGroupActions.loading.toString()]: (
      state,
      action,
    ) => {
      return state.setIn(
        ['updateDefaultEstablishmentBillingGroup', 'loading'],
        action.payload,
      );
    },
    [uploadLeadManagementFileActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['leadManagementUpload', 'error'], payload);
    },
    [uploadLeadManagementFileActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['leadManagementUpload', 'loading'], payload);
    },
    ...GenericListReducer(membersListWithTagRepo),
    ...GenericListReducer(membersListWithoutTagRepo),
    ...GenericReducer(tagAllMemberRepo),
    ...GenericReducer(untagAllMemberRepo),
  },
  initialState,
);
