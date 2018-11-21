// @flow
import {
  API_URI,
  getAuth,
  patchAuth,
  deleteAuth,
  postAuth,
  putAuth,
} from '../http';

export async function fetchAllMembers() {
  return getAuth(`${API_URI}/saas/members`);
}

export async function fetchMember(memberId: number) {
  return getAuth(`${API_URI}/saas/members/${memberId}`);
}

export async function addMember(data: Object) {
  return postAuth(`${API_URI}/saas/create-member/`, data);
}

export async function updateMember(data: Object) {
  return putAuth(`${API_URI}/saas/member/${data.get('id')}`, data);
}

export async function createNote(id: number, text: string, memberId: number) {
  return postAuth(`${API_URI}/saas/member/${memberId}/note`, {
    text,
    member: memberId,
  });
}
export async function updateNote(id: number, text: string) {
  return patchAuth(`${API_URI}/saas/member/note/${id}`, { text });
}
export async function deleteNote(id: number) {
  return deleteAuth(`${API_URI}/saas/member/note/${id}`);
}

export default {
  fetchAll: fetchAllMembers,
  updateMember,
  fetchMember,
  addMember,
  createNote,
  updateNote,
  deleteNote,
};
