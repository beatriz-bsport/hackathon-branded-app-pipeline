import { push } from 'connected-react-router';
import uniq from 'lodash/uniq';
import { createAction } from 'redux-actions';

import * as Sentry from '@sentry/react';
import { snackbarError, snackbarSuccess } from '../snackbar/actions';
import {
  fetchMyUserProfileAPI,
  updateMember,
  addMember,
  updateNote,
  createNote,
  deleteNote as deleteNoteApi,
  fetchMember as fetchMemberApi,
  fetchFilteredMembers as fetchFilteredMembersAPI,
  search as searchApi,
  tag as tagApi,
  untag as untagApi,
  tagAll as tagAllApi,
  untagAll as untagAllApi,
  merge as mergeApi,
  addFile as addFileAPI,
  regularizeDebt as regularizeDebtAPI,
  removeFile as removeFileAPI,
  linkMeToCompany as linkMeToCompanyAPI,
  fetchCountObject as fetchCountObjectAPI,
  fetchCommunicationsPaginatedMembers as fetchCommunicationsPaginatedMembersAPI,
  adjustCreditWithoutPaymentNote as adjustCreditWithoutPaymentNoteAPI,
} from './api';
import type { Member, MemberMinimal } from './types';

import type { Dispatch, OptionCallback, ThunkAction } from '../../state/types';
import {
  GenericAsyncAction,
  GenericListAsyncAction,
  GenericListRepo,
  GenericRepo,
} from '../../utils/reduxHelper';

export const actionTypes = {
  START_FETCH_MEMBER: 'START_FETCH_MEMBER',
  HAS_FETCHED_MEMBER: 'HAS_FETCHED_MEMBER',
  ERROR_FETCHING_MEMBER: 'ERROR_FETCHING_MEMBER',
  MEMBER_CREATE_OR_UPDATE: 'MEMBER_CREATE_OR_UDPATE',
  MEMBER_CREATE_OR_UPDATE_SUCCESS: 'MEMBER_CREATE_OR_UPDATE_SUCCESS',
  MEMBER_CREATE_OR_UPDATE_ERROR: 'MEMBER_CREATE_OR_UPDATE_ERROR',
  MEMBER_UPDATE: 'MEMBER_UPDATE',

  MEMBER_NOTE_CREATEORUPDATE_ERROR: 'MEMBER_NOTE_CREATEORUPDATE_ERROR',
  MEMBER_NOTE_CREATEORUPDATE_SUCCESS: 'MEMBER_NOTE_CREATEORUPDATE_SUCCESS',
  MEMBER_NOTE_CREATEORUPDATE_START: 'MEMBER_NOTE_CREATEORUPDATE_START',

  MEMBER_TAG_ERROR: 'MEMBER_TAG_ERROR',
  MEMBER_TAG_SUCCESS: 'MEMBER_TAG_SUCCESS',
  MEMBER_TAG_START: 'MEMBER_TAG_START',

  MEMBER_NOTE_DELETE_START: 'MEMBER_NOTE_DELETE_START',
  MEMBER_NOTE_DELETE_ERROR: 'MEMBER_NOTE_DELETE_ERROR',
  MEMBER_NOTE_DELETE_SUCCESS: 'MEMBER_NOTE_DELETE_SUCCESS',

  MEMBER_SEARCH_START: 'MEMBER_SEARCH_START',
  MEMBER_SEARCH_ERROR: 'MEMBER_SEARCH_ERROR',
  MEMBER_SEARCH_SUCCESS: 'MEMBER_SEARCH_SUCCESS',

  MEMBER_MERGE_START: 'MEMBER_MERGE_START',
  MEMBER_MERGE_ERROR: 'MEMBER_MERGE_ERROR',
  MEMBER_MERGE_SUCCESS: 'MEMBER_MERGE_SUCCESS',

  MEMBER_LINKED_SUCCESS: 'MEMBER_LINKED_SUCCESS',
  MEMBER_LINKED_ERROR: 'MEMBER_LINKED_ERROR',

  MEMBER_ADD_FILE_LOADING: 'MEMBER_ADD_FILE_LOADING',
  MEMBER_ADD_FILE_SUCCESS: 'MEMBER_ADD_FILE_SUCCESS',
  MEMBER_ADD_FILE_ERROR: 'MEMBER_ADD_FILE_ERROR',

  MEMBER_REMOVE_FILE_LOADING: 'MEMBER_REMOVE_FILE_LOADING',
  MEMBER_REMOVE_FILE_SUCCESS: 'MEMBER_REMOVE_FILE_SUCCESS',
  MEMBER_REMOVE_FILE_ERROR: 'MEMBER_REMOVE_FILE_ERROR',
};

export const barcodeRetrieveAction = {
  isLoading: createAction('MEMBER/BY_BARCODE/LOADING'),
  error: createAction('MEMBER/BY_BARCODE/ERROR'),
  success: createAction('MEMBER/BY_BARCODE/SUCCESS'),
  reset: createAction('MEMBER/BY_BARCODE/RESET'),
};

export const resetMemberByBarcode = barcodeRetrieveAction.reset;

class NoMemberWithBarcode extends Error {
  constructor(message: any) {
    super(message); // (1)
    this.name = 'NoMemberWithBarcode';
  }
}

export function fetchMemberByBarcode(
  barcode: string,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(barcodeRetrieveAction.isLoading(true));
    try {
      const response = await fetchFilteredMembersAPI({ barcode });
      if (response.data.results.length) {
        dispatch(barcodeRetrieveAction.success(response.data.results[0]));
        if (options && options.onSuccess) {
          options.onSuccess(response.data.results[0]);
        }
      } else {
        throw NoMemberWithBarcode;
      }
    } catch (err) {
      console.error(err);
      dispatch(barcodeRetrieveAction.error(err));
      if (options && options.onError) options.onError(err);
    }
    dispatch(barcodeRetrieveAction.isLoading(false));
  };
}

export const memberListActions = {
  isLoading: createAction('MEMBER/LIST/LOADING'),
  error: createAction('MEMBER/LIST/ERROR'),
  success: createAction('MEMBER/LIST/SUCCESS'),
};

export function refreshFilteredMembers(
  params: any,
  options: OptionCallback<MemberMinimal[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberListActions.isLoading(true));
    try {
      const response = await fetchFilteredMembersAPI(params);
      dispatch(memberListActions.success(response.data));
      const member = response.data.results;
      if (options && options.onSuccess) {
        options.onSuccess(member);
      }
    } catch (err) {
      console.error(err);
      dispatch(memberListActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(memberListActions.isLoading(false));
  };
}

export const memberBulkActions = {
  isLoading: createAction('MEMBER/BULK/LOADING'),
  error: createAction('MEMBER/BULK/ERROR'),
  success: createAction('MEMBER/BULK/SUCCESS'),
};

export const memberCountObject = {
  isLoading: createAction('MEMBER/COUNT/LOADING'),
  error: createAction('MEMBER/COUNT/ERROR'),
  success: createAction('MEMBER/COUNT/SUCCESS'),
};

export function fetchCountObjects(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(memberCountObject.isLoading(true));
    try {
      const response = await fetchCountObjectAPI(id);
      dispatch(memberCountObject.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(memberCountObject.error(err));
    }
    dispatch(memberCountObject.isLoading(false));
  };
}

export function fetchMemberBulk(params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(memberBulkActions.isLoading(true));
    try {
      const response = await fetchFilteredMembersAPI(params);
      dispatch(memberBulkActions.success(response.data.results));
    } catch (err) {
      console.error(err);
      dispatch(memberBulkActions.error(err));
      dispatch(memberBulkActions.error(err));
    }
    dispatch(memberBulkActions.isLoading(false));
  };
}

export function fetchMemberBulkById(ids: Array<number>) {
  return async (dispatch: Dispatch) => {
    const id_uniq = uniq(ids);
    if (!id_uniq.length) return;
    dispatch(memberBulkActions.isLoading(true));
    try {
      const response = await fetchFilteredMembersAPI({ id__in: id_uniq });
      dispatch(memberBulkActions.success(response.data.results));
    } catch (err) {
      console.error(err);
      dispatch(memberBulkActions.error(err));
      dispatch(memberBulkActions.error(err));
    }
    dispatch(memberBulkActions.isLoading(false));
  };
}

export function fetchFilteredMembers(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(memberListActions.isLoading(true));
    dispatch(refreshFilteredMembers(params, options));
    dispatch(memberListActions.isLoading(false));
  };
}

export const memberListPaginatedActions = {
  isLoading: createAction('MEMBER/LIST_PAGINATED/LOADING'),
  error: createAction('MEMBER/LIST_PAGINATED/ERROR'),
  success: createAction('MEMBER/LIST_PAGINATED/SUCCESS'),
};

export function fetchCommunicationsPaginatedMembers(
  params: any,
  id__in: number[],
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberListPaginatedActions.isLoading(true));
    try {
      const response = await fetchCommunicationsPaginatedMembersAPI(
        params,
        id__in,
      );
      dispatch(
        memberListPaginatedActions.success({
          ...response.data,
          page: params.page || 1,
        }),
      );
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      dispatch(memberListPaginatedActions.error(error));
    }
    dispatch(memberListPaginatedActions.isLoading(false));
  };
}

export function successLinkConsumer(data: Member) {
  return { type: actionTypes.MEMBER_LINKED_SUCCESS, data };
}
export function errorLinkConsumer(error?: Error) {
  return { type: actionTypes.MEMBER_LINKED_ERROR, error };
}
export function linkMeToCompany(data: any) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await linkMeToCompanyAPI(data);
      dispatch(successLinkConsumer(response.data));
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      dispatch(errorLinkConsumer(err));
    }
  };
}

export function startTag(memberId: number, tagId: number) {
  return { type: actionTypes.MEMBER_TAG_START, memberId, tagId };
}
export function errorTag(error?: Error) {
  return { type: actionTypes.MEMBER_TAG_ERROR, error };
}
export function successTag(member: Member) {
  return { type: actionTypes.MEMBER_TAG_SUCCESS, member };
}

export function tag(memberId: number, tagId: number, options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startTag(memberId, tagId));
    try {
      const response = await tagApi(memberId, tagId);
      const member = response.data;
      dispatch(successTag(member));
      if (options && options.onSuccess) {
        options.onSuccess(member);
      }
    } catch (err) {
      console.error(err);
      dispatch(errorSearch(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function untag(
  memberId: number,
  tagId: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(startTag(memberId, tagId));
    try {
      const response = await untagApi(memberId, tagId);
      const member = response.data;
      dispatch(successTag(member));
      if (options && options.onSuccess) {
        options.onSuccess(member);
      }
    } catch (err) {
      console.error(err);
      dispatch(errorSearch(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export function startSearch(text: string) {
  return { type: actionTypes.MEMBER_SEARCH_START, text };
}
export function errorSearch(error?: Error) {
  return { type: actionTypes.MEMBER_SEARCH_ERROR, error };
}
export function successSearch(members: Array<Member>) {
  return { type: actionTypes.MEMBER_SEARCH_SUCCESS, members };
}

export function search(text: string) {
  return async (dispatch: Dispatch) => {
    dispatch(startSearch(text));
    try {
      if (text) {
        const response = await searchApi(text);
        const members = response.data;
        dispatch(successSearch(members));
      } else dispatch(successSearch([]));
    } catch (err) {
      console.error(err);
      dispatch(errorSearch(err));
    }
  };
}

export function fetchMember(id: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchMember());

    try {
      const response = await fetchMemberApi(id);
      const member = response.data;
      dispatch(hasFetchedMember(member));
      if (options && options.onSuccess) {
        options.onSuccess(member);
      }
    } catch (err) {
      console.error(err);
      dispatch(errorFetchingMember());
      if (options && options.onError) {
        options.onError(err);
      }
    }
  };
}

export const memberRegularizeDebtActions = {
  isLoading: createAction('MEMBER/REGULARIZE_DEBT/LOADING'),
  error: createAction('MEMBER/REGULARIZE_DEBT/ERROR'),
  success: createAction('MEMBER/REGULARIZE_DEBT/SUCCESS'),
};

export function regularizeDebt(
  memberId: number,
  data: any,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(memberRegularizeDebtActions.isLoading(true));

    try {
      const response = await regularizeDebtAPI(memberId, data);
      dispatch(memberRegularizeDebtActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response);
      }
    } catch (err) {
      console.error(err);
      dispatch(memberRegularizeDebtActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(memberRegularizeDebtActions.isLoading(false));
  };
}

export function startFetchMember() {
  return { type: actionTypes.START_FETCH_MEMBER };
}

export function hasFetchedMember(member: any) {
  return { type: actionTypes.HAS_FETCHED_MEMBER, member };
}

export function errorFetchingMember() {
  return { type: actionTypes.ERROR_FETCHING_MEMBER };
}

export function createOrUpdateMember(
  id: number,
  memberData: FormData,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateMember(memberData));

    const createOrUpdate = id ? updateMember : addMember;
    try {
      const response: any = await createOrUpdate(memberData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response);
      }
      dispatch(actionCreateOrUpdateMemberSuccess(response));
      dispatch(
        snackbarSuccess(id ? 'member.update.success' : 'member.create.success'),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('member.error'));
      dispatch(actionCreateOrUpdateMemberError(e));
      if (options && options.onError) {
        options.onError((e || {}).response ? e.response.data : {});
      }
    }
  };
}

export const fetchMyUserProfileActions = {
  isLoading: createAction('USER_PROFILE/ME/LOADING'),
  error: createAction('USER_PROFILE/ME/ERROR'),
  success: createAction('USER_PROFILE/ME/SUCCESS'),
};
export function fetchMyUserProfile(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMyUserProfileActions.isLoading(true));
    try {
      const response = await fetchMyUserProfileAPI();
      dispatch(fetchMyUserProfileActions.success(response.data));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(fetchMyUserProfileActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchMyUserProfileActions.isLoading(false));
  };
}
export function actionCreateOrUpdateMember(memberData: any) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE, member: memberData };
}
export function actionCreateOrUpdateMemberSuccess(response: any) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateMemberError(error?: Error) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR, error };
}
export function actionStartUpdate(member: any) {
  return { type: actionTypes.MEMBER_UPDATE, member };
}
export function startUpdate(member: { id: number }) {
  return async (dispatch: Dispatch) => {
    dispatch(actionStartUpdate(member));
    dispatch(push(`/member/edit/${member.id}`));
  };
}

export function createOrUpdateNote(
  id: number,
  text: string,
  memberId: number,
  highlighted: boolean,
  is_medical: boolean,
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateNoteStart());

    const createOrUpdate = id ? updateNote : createNote;
    try {
      const response = await createOrUpdate(
        id,
        text,
        memberId,
        highlighted,
        is_medical,
      );

      if (response.status === 201 || response.status === 200) {
        const note = response.data;
        dispatch(actionCreateOrUpdateNoteSuccess(note));
        dispatch(snackbarSuccess('member.createOrUpdate.success'));
      } else {
        dispatch(snackbarError('member.createOrUpdate.error'));
        dispatch(actionCreateOrUpdateNoteError());
      }
    } catch (e) {
      dispatch(snackbarError('member.createOrUpdate.error'));
      dispatch(actionCreateOrUpdateNoteError(e));
    }
  };
}

export function actionCreateOrUpdateNoteError(error?: any) {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_ERROR, error };
}

export function actionCreateOrUpdateNoteSuccess(note: any) {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS, note };
}

export function actionCreateOrUpdateNoteStart() {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_START };
}

export function deleteNote({
  noteId,
  memberId,
}: {
  noteId: number;
  memberId: number;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(actionDeleteNoteStart());

    try {
      const response = await deleteNoteApi(noteId);

      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 204
      ) {
        dispatch(actionDeleteNoteSuccess(noteId, memberId));
        dispatch(snackbarSuccess('memberNote.delete.success'));
      } else {
        dispatch(snackbarError('memberNote.delete.error'));
        dispatch(actionDeleteNoteError());
      }
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('memberNote.delete.error'));
      dispatch(actionDeleteNoteError());
    }
  };
}

export function actionDeleteNoteError() {
  return { type: actionTypes.MEMBER_NOTE_DELETE_ERROR };
}

export function actionDeleteNoteSuccess(noteId: number, memberId: number) {
  return { type: actionTypes.MEMBER_NOTE_DELETE_SUCCESS, noteId, memberId };
}

export function actionDeleteNoteStart() {
  return { type: actionTypes.MEMBER_NOTE_DELETE_START };
}

export function actionMergeSuccess(src: number, dst: number) {
  return { type: actionTypes.MEMBER_MERGE_SUCCESS, src, dst };
}

export function actionMergeStart(src: number, dst: number) {
  return { type: actionTypes.MEMBER_MERGE_START, src, dst };
}

export function actionMergeError(err: any) {
  return { type: actionTypes.MEMBER_MERGE_ERROR, err };
}

export function mergeMembers(
  src: number,
  dst: number,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionMergeStart(src, dst));

    try {
      const response: any = await mergeApi(src, dst);

      if (response.status !== 200) {
        throw new Error(response);
      }
      dispatch(actionMergeSuccess(src, dst));
      dispatch(snackbarSuccess('member.merge.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('member.merge.error'));
      dispatch(actionMergeError(e));
      if (options && options.onError) {
        options.onError((e || {}).response ? e.response.data : {});
      }
    }
  };
}

export function actionAddFileSuccess(response: any) {
  return { type: actionTypes.MEMBER_ADD_FILE_SUCCESS, response };
}
export function actionAddFileError(error?: Error) {
  return { type: actionTypes.MEMBER_ADD_FILE_ERROR, error };
}
export function actionAddFileLoading(loading: boolean) {
  return { type: actionTypes.MEMBER_ADD_FILE_LOADING, loading };
}

export function addFileToMember({
  data,
  member_id,
  name,
}: {
  data: File;
  member_id: number;
  name: string;
}): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(actionAddFileLoading(true));
    dispatch(actionAddFileError(null));

    try {
      const fileData = new FormData();
      fileData.append('file', data);
      fileData.append('member', member_id.toString());
      fileData.append('name', name);
      const response = await addFileAPI(fileData);
      dispatch(actionAddFileSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(actionAddFileError(error));
    }
    dispatch(actionAddFileLoading(false));
  };
}
export function actionRemoveFileSuccess(response: any) {
  return { type: actionTypes.MEMBER_REMOVE_FILE_SUCCESS, response };
}
export function actionRemoveFileError(error?: Error) {
  return { type: actionTypes.MEMBER_REMOVE_FILE_ERROR, error };
}
export function actionRemoveFileLoading(loading: boolean) {
  return { type: actionTypes.MEMBER_REMOVE_FILE_LOADING, loading };
}

export function removeFileFromMember(
  memberId: number,
  fileId: number,
): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(actionRemoveFileLoading(true));
    dispatch(actionRemoveFileError(null));

    try {
      await removeFileAPI(fileId);
      dispatch(actionRemoveFileSuccess({ memberId, fileId }));
    } catch (error) {
      console.error(error);
      dispatch(actionRemoveFileError(error));
    }
    dispatch(actionRemoveFileLoading(false));
  };
}

export const adjustCreditWithoutPaymentNoteActions = {
  isLoading: createAction('MEMBER/ADJUST_CREDIT/LOADING'),
  error: createAction('MEMBER/ADJUST_CREDIT/ERROR'),
  success: createAction('MEMBER/ADJUST_CREDIT/SUCCESS'),
};

export function adjustCreditWithoutPaymentNote(
  memberId: number,
  amount: number,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(adjustCreditWithoutPaymentNoteActions.isLoading(true));

    try {
      const response = await adjustCreditWithoutPaymentNoteAPI(
        memberId,
        amount,
      );
      dispatch(adjustCreditWithoutPaymentNoteActions.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(adjustCreditWithoutPaymentNoteActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(adjustCreditWithoutPaymentNoteActions.isLoading(false));
  };
}

export const membersListWithTagRepo = GenericListRepo<Member>('membersWithTag');
export const fetchMemberListWithTagsAction = GenericListAsyncAction(
  membersListWithTagRepo,
  fetchFilteredMembersAPI,
);

export const membersListWithoutTagRepo =
  GenericListRepo<Member>('membersWithoutTag');
export const fetchMemberListWithoutTagsAction = GenericListAsyncAction(
  membersListWithoutTagRepo,
  fetchFilteredMembersAPI,
);

export const tagAllMemberRepo = GenericRepo<null>('tagAllMembers');
export const fetchTagAllMembersAction = GenericAsyncAction(
  tagAllMemberRepo,
  tagAllApi,
);

export const untagAllMemberRepo = GenericRepo<null>('untagAllMembers');
export const fetchUntagAllMemberAction = GenericAsyncAction(
  untagAllMemberRepo,
  untagAllApi,
);
