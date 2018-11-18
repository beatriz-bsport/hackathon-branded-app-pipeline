// @flow

import { push } from 'react-router-redux';

import { snackbarError, snackbarSuccess } from './snackbar.actions';
import api from '../api';
import types from './member.types';

export function fetchAll() {
  return async (dispatch) => {
    dispatch(startFetchMembers());

    try {
      const response = await api.member.fetchAll();
      const members = response.data;

      dispatch(fetchedMembers(members));
    } catch (err) {
      dispatch(errorFetchingMembers());
    }
  };
}

export function fetchedMembers(members) {
  return { type: types.HAS_FETCHED_MEMBERS, members };
}
export function startFetchMembers() {
  return { type: types.START_FETCH_MEMBERS };
}

export function errorFetchingMembers() {
  return { type: types.ERROR_FETCHING_MEMBERS };
}

export function fetchMember(id) {
  return async (dispatch) => {
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

export function hasFetchedMember(member) {
  return { type: types.HAS_FETCHED_MEMBER, member };
}

export function errorFetchingMember() {
  return { type: types.ERROR_FETCHING_MEMBER };
}

export function createOrUpdateMember(memberData, dontRedirect) {
  return async (dispatch) => {
    dispatch(actionCreateOrUpdateMember(memberData));

    const createOrUpdate = memberData.has('id')
      ? api.member.updateMember
      : api.member.addMember;
    try {
      const response = await createOrUpdate(memberData);

      if (response.status === 201 || response.status === 200) {
        dispatch(actionCreateOrUpdateMemberSuccess(response));
        dispatch(
          snackbarSuccess(
            memberData.has('id')
              ? 'member.forms.update.success'
              : 'member.forms.create.success',
          ),
        );
        dispatch(fetchAll());
        if (dontRedirect) {
          dispatch(push('/member'));
        }
      } else {
        dispatch(snackbarError('member.forms.error'));
        dispatch(actionCreateOrUpdateMemberError());
      }
    } catch (e) {
      console.log(e);
      dispatch(snackbarError('member.forms.error'));
      dispatch(actionCreateOrUpdateMemberError(e));
    }
  };
}

export function actionCreateOrUpdateMember(memberData) {
  return { type: types.MEMBER_CREATE_OR_UPDATE, member: memberData };
}
export function actionCreateOrUpdateMemberSuccess(response) {
  return { type: types.MEMBER_CREATE_OR_UPDATE_SUCCESS, response };
}
export function actionCreateOrUpdateMemberError(error) {
  return { type: types.MEMBER_CREATE_OR_UPDATE_ERROR, error };
}
export function actionStartUpdate(member) {
  return { type: types.MEMBER_UPDATE, member };
}
export function startUpdate(member) {
  return async (dispatch) => {
    dispatch(actionStartUpdate(member));
    dispatch(push(`/member/edit/${member.id}`));
  };
}
