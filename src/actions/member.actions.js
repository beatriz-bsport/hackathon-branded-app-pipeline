// @flow weak

import { push } from 'react-router-redux';
import { createListHandler } from './utils';

import { snackbarError, snackbarSuccess } from './snackbar.actions';
import api from '../api';
import types from './member.types';

import type { Dispatch } from '../state/types';

export function quickFetchSuccess(member: {}) {
  return { type: types.SUCCESS_QUICK_FETCH_MEMBER, member };
}

export function startFetchMemberByOffer() {
  return { type: types.START_FETCH_MEMBER_BY_OFFER };
}
export function hasFetchedMemberByOffer(members) {
  return { type: types.SUCCESS_FETCH_MEMBER_BY_OFFER, members };
}
export function errorFetchingMemberByOffer() {
  return { type: types.ERROR_FETCH_MEMBER_BY_OFFER };
}

export function refreshByOffer(id: number) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.member.fetchByOffer(id);
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

export function quickFetch(id: number) {
  return async (dispatch: Dispatch) => {
    try {
      const response = await api.member.quickFetch(id);
      const member = response.data;

      dispatch(quickFetchSuccess(member));
    } catch (err) {
      console.error(err);
    }
  };
}

const { fetcher, listReducers } = createListHandler(
  'member',
  api.member.fetchAll,
);
export { fetcher as fetchAll, listReducers as listMemberReducers };

export function fetchMember(id: number) {
  return async (dispatch: Dispatch) => {
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

export function hasFetchedMember(member: *) {
  return { type: types.HAS_FETCHED_MEMBER, member };
}

export function errorFetchingMember() {
  return { type: types.ERROR_FETCHING_MEMBER };
}

export function createOrUpdateMember(
  memberData: FormData,
  dontRedirect: boolean,
  options,
  callback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateMember(memberData));

    const createOrUpdate = memberData.has('id')
      ? api.member.updateMember
      : api.member.addMember;
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
      if (callback) {
        callback();
      } else {
        dispatch(fetcher());
      }
      if (options && options.onSuccess) options.onSuccess();
      if (!dontRedirect) {
        dispatch(push('/member'));
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('member.forms.error'));
      dispatch(actionCreateOrUpdateMemberError(e));
      if (options && options.onError) {
        options.onError((e || {}).response ? e.response.data : {});
      }
    }
  };
}

export function actionCreateOrUpdateMember(memberData: *) {
  return { type: types.MEMBER_CREATE_OR_UPDATE, member: memberData };
}
export function actionCreateOrUpdateMemberSuccess(response: *) {
  return { type: types.MEMBER_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateMemberError(error: ?Error) {
  return { type: types.MEMBER_CREATE_OR_UPDATE_ERROR, error };
}
export function actionStartUpdate(member: *) {
  return { type: types.MEMBER_UPDATE, member };
}
export function startUpdate(member: { id: number }) {
  return async (dispatch: Dispatch) => {
    dispatch(actionStartUpdate(member));
    dispatch(push(`/member/edit/${member.id}`));
  };
}

export function createOrUpdateNote(id: number, text: string, memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(actionCreateOrUpdateNoteStart());

    const createOrUpdate = id ? api.member.updateNote : api.member.createNote;
    try {
      const response = await createOrUpdate(id, text, memberId);

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

export function actionCreateOrUpdateNoteError() {
  return { type: types.MEMBER_NOTE_CREATEORUPDATE_ERROR };
}

export function actionCreateOrUpdateNoteSuccess(note) {
  return { type: types.MEMBER_NOTE_CREATEORUPDATE_SUCCESS, note };
}

export function actionCreateOrUpdateNoteStart() {
  return { type: types.MEMBER_NOTE_CREATEORUPDATE_START };
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
      const response = await api.member.deleteNote(noteId);

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
  return { type: types.MEMBER_NOTE_DELETE_ERROR };
}

export function actionDeleteNoteSuccess(noteId: number, memberId: number) {
  return { type: types.MEMBER_NOTE_DELETE_SUCCESS, noteId, memberId };
}

export function actionDeleteNoteStart() {
  return { type: types.MEMBER_NOTE_DELETE_START };
}
