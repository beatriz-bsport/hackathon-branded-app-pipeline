// @flow weak

import { push } from 'react-router-redux';

import * as Sentry from '@sentry/browser';
import { snackbarError, snackbarSuccess } from '../../actions/snackbar.actions';
import {
  updateMember,
  addMember,
  updateNote,
  createNote,
  deleteNote as deleteNoteApi,
  fetchMember as fetchMemberApi,
  fetchByQueryMember as fetchByQueryMemberApi,
  fetchByOffer as fetchByOfferApi,
  search as searchApi,
  tag as tagApi,
  merge as mergeApi,
  linkMeToCompany as linkMeToCompanyAPI,
} from './api';

import type { Member } from './types';

import type { Dispatch } from '../../state/types';

export const actionTypes = {
  START_FETCH_MEMBERS: 'START_FETCH_MEMBERS',
  HAS_FETCHED_MEMBERS: 'HAS_FETCHED_MEMBERS',
  ERROR_FETCHING_MEMBERS: 'ERROR_FETCHING_MEMBERS',
  HAS_FETCHED_MEMBER_BOOKINGS: 'HAS_FETCHED_MEMBER_BOOKINGS',
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

  SUCCESS_QUICK_FETCH_MEMBER: 'SUCCESS_QUICK_FETCH_MEMBER',

  START_FETCH_MEMBER_BY_OFFER: 'START_FETCH_MEMBER_BY_OFFER',
  SUCCESS_FETCH_MEMBER_BY_OFFER: 'SUCCESS_FETCH_MEMBER_BY_OFFER',
  ERROR_FETCH_MEMBER_BY_OFFER: 'ERROR_FETCH_MEMBER_BY_OFFER',

  MEMBER_SEARCH_START: 'MEMBER_SEARCH_START',
  MEMBER_SEARCH_ERROR: 'MEMBER_SEARCH_ERROR',
  MEMBER_SEARCH_SUCCESS: 'MEMBER_SEARCH_SUCCESS',

  MEMBER_MERGE_START: 'MEMBER_MERGE_START',
  MEMBER_MERGE_ERROR: 'MEMBER_MERGE_ERROR',
  MEMBER_MERGE_SUCCESS: 'MEMBER_MERGE_SUCCESS',

  MEMBER_LINKED_SUCCESS: 'MEMBER_LINKED_SUCCESS',
  MEMBER_LINKED_ERROR: 'MEMBER_LINKED_ERROR',
};

export function successLinkConsumer(data) {
  return { type: actionTypes.MEMBER_LINKED_SUCCESS, data };
}
export function errorLinkConsumer(error) {
  return { type: actionTypes.MEMBER_LINKED_ERROR, error };
}
export function linkMeToCompany(data: *) {
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
export function errorTag(error: ?Error) {
  return { type: actionTypes.MEMBER_TAG_ERROR, error };
}
export function successTag(member: Member) {
  return { type: actionTypes.MEMBER_TAG_SUCCESS, member };
}

export function tag(memberId: number, tagId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startTag(memberId, tagId));
    try {
      const response = await tagApi(memberId, tagId);
      const member = response.data;
      dispatch(successTag(member));
    } catch (err) {
      console.error(err);
      dispatch(errorSearch(err));
    }
  };
}

export function startSearch(text: string) {
  return { type: actionTypes.MEMBER_SEARCH_START, text };
}
export function errorSearch(error: ?Error) {
  return { type: actionTypes.MEMBER_SEARCH_ERROR, error };
}
export function successSearch(members: Array<Member>) {
  return { type: actionTypes.MEMBER_SEARCH_SUCCESS, members };
}

export function search(text: string) {
  return async (dispatch: Dispatch) => {
    dispatch(startSearch(text));
    try {
      const response = await searchApi(text);
      const members = response.data;
      dispatch(successSearch(members));
    } catch (err) {
      console.error(err);
      dispatch(errorSearch(err));
    }
  };
}

export function startFetchMemberByOffer() {
  return { type: actionTypes.START_FETCH_MEMBER_BY_OFFER };
}
export function hasFetchedMemberByOffer(members) {
  return { type: actionTypes.SUCCESS_FETCH_MEMBER_BY_OFFER, members };
}
export function errorFetchingMemberByOffer() {
  return { type: actionTypes.ERROR_FETCH_MEMBER_BY_OFFER };
}

export function refreshByOffer(id: number) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await fetchByOfferApi(id);
      const members = response.data;
      dispatch(hasFetchedMemberByOffer(members));
    } catch (err) {
      console.error(err);
      dispatch(errorFetchingMemberByOffer());
    }
  };
}

export function fetchMemberByOffer(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchMemberByOffer());
    dispatch(refreshByOffer(id));
  };
}

export function fetchMember(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchMember());

    try {
      const response = await fetchMemberApi(id);
      const member = response.data;
      dispatch(hasFetchedMember(member));
    } catch (err) {
      dispatch(errorFetchingMember());
    }
  };
}

export function fetchByQueryMember(params: *) {
  return async (dispatch: Dispatch) => {
    dispatch(startFetchMember());

    try {
      const response = await fetchByQueryMemberApi(params);
      const member = response.data.results;
      dispatch(hasFetchedMember(member[0]));
    } catch (err) {
      dispatch(errorFetchingMember());
    }
  };
}

export function startFetchMember() {
  return { type: actionTypes.START_FETCH_MEMBER };
}

export function hasFetchedMember(member: *) {
  return { type: actionTypes.HAS_FETCHED_MEMBER, member };
}

export function errorFetchingMember() {
  return { type: actionTypes.ERROR_FETCHING_MEMBER };
}

export function createOrUpdateMember(memberData: FormData, options) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateMember(memberData));

    const createOrUpdate = memberData.has('id') ? updateMember : addMember;
    try {
      const response = await createOrUpdate(memberData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response);
      }
      dispatch(actionCreateOrUpdateMemberSuccess(response));
      dispatch(
        snackbarSuccess(
          memberData.has('id')
            ? 'member.forms.update.success'
            : 'member.forms.create.success',
        ),
      );
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('member.forms.error'));
      dispatch(actionCreateOrUpdateMemberError(e));
      if (options && options.onError) {
        options.onError((e || {}).response ? e.response.data : {});
      }
    }
  };
}

export function actionCreateOrUpdateMember(memberData: *) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE, member: memberData };
}
export function actionCreateOrUpdateMemberSuccess(response: *) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateMemberError(error: ?Error) {
  return { type: actionTypes.MEMBER_CREATE_OR_UPDATE_ERROR, error };
}
export function actionStartUpdate(member: *) {
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
        dispatch(snackbarSuccess('form.member.createOrUpdate.success'));
      } else {
        dispatch(snackbarError('form.member.createOrUpdate.error'));
        dispatch(actionCreateOrUpdateNoteError());
      }
    } catch (e) {
      dispatch(snackbarError('form.member.createOrUpdate.error'));
      dispatch(actionCreateOrUpdateNoteError(e));
    }
  };
}

export function actionCreateOrUpdateNoteError(error) {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_ERROR, error };
}

export function actionCreateOrUpdateNoteSuccess(note) {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_SUCCESS, note };
}

export function actionCreateOrUpdateNoteStart() {
  return { type: actionTypes.MEMBER_NOTE_CREATEORUPDATE_START };
}

export function deleteNote({
  noteId,
  memberId,
}: {
  noteId: number,
  memberId: number,
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
        dispatch(snackbarSuccess('form.member.delete.success'));
      } else {
        dispatch(snackbarError('form.member.delete.error'));
        dispatch(actionDeleteNoteError());
      }
    } catch (e) {
      dispatch(snackbarError('form.member.delete.error'));
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

export function actionMergeError(err) {
  return { type: actionTypes.MEMBER_MERGE_ERROR, err };
}

export function mergeMembers(
  src: number,
  dst: number,
  options: ?{ onSuccess?: () => void, onError?: (?Error | {}) => void },
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionMergeStart(src, dst));

    try {
      const response = await mergeApi(src, dst);

      if (response.status !== 200) {
        throw new Error(response);
      }
      dispatch(actionMergeSuccess(src, dst));
      dispatch(snackbarSuccess('member.forms.merge.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (e) {
      console.error(e);
      dispatch(snackbarError('member.forms.merge.error'));
      dispatch(actionMergeError(e));
      if (options && options.onError) {
        options.onError((e || {}).response ? e.response.data : {});
      }
    }
  };
}
