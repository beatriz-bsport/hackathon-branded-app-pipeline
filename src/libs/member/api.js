// @flow
import {
  API_URI,
  getAuth,
  patchAuth,
  deleteAuth,
  postAuth,
  putAuth,
  buildUrlParams,
} from '../../http';

const PAGE_SIZE = 2000;

export async function fetchAllMembers({
  page,
  page_size,
  tags_excluded,
  tags_included,
}: {
  page: number,
  page_size: ?number,
}) {
  return getAuth(
    `${API_URI}/saas/members/minimal?page_size=${page_size ||
      PAGE_SIZE}&page=${page}${
      tags_included ? `&tags_included=${JSON.stringify(tags_included)}` : ''
    }${tags_excluded ? `&tags_excluded=${JSON.stringify(tags_excluded)}` : ''}`,
  );
}

export async function search(text: string) {
  return postAuth(`${API_URI}/saas/members/members/search/`, { text });
}

export async function tag(memberId: number, tagId: number) {
  return postAuth(`${API_URI}/saas/members/members/${memberId}/tag/`, {
    tag: tagId,
  });
}

export async function fetchByOffer(offerId: number) {
  return getAuth(
    `${API_URI}/saas/members/offer/${offerId}/?no-deprecated=true`,
  );
}

export async function fetchMember(memberId: number) {
  return getAuth(`${API_URI}/saas/members/${memberId}?no-deprecated=true`);
}

export async function fetchByQueryMember(params: *) {
  const urlParams = buildUrlParams(params);
  return getAuth(`${API_URI}/saas/members/members/find/${urlParams}`);
}

export async function getLatest() {
  return getAuth(`${API_URI}/saas/members/members/latest/`);
}

export async function addMember(data: Object) {
  return postAuth(`${API_URI}/saas/create-member/`, data);
}

export async function updateMember(data: Object) {
  return putAuth(`${API_URI}/saas/member/${data.get('id')}`, data);
}

export async function merge(src: number, dst: number) {
  return postAuth(`${API_URI}/saas/members/members/merge/`, { src, dst });
}

export async function createNote(
  id: number,
  text: string,
  memberId: number,
  highlighted: boolean,
) {
  return postAuth(`${API_URI}/saas/member/${memberId}/note`, {
    text,
    member: memberId,
    highlighted,
  });
}
export async function updateNote(
  id: number,
  text: string,
  memberId: number,
  highlighted: boolean,
) {
  return patchAuth(`${API_URI}/saas/member/note/${id}`, { text, highlighted });
}
export async function deleteNote(id: number) {
  return deleteAuth(`${API_URI}/saas/member/note/${id}`);
}

export default {
  fetchAll: fetchAllMembers,
  fetchByOffer,
  updateMember,
  fetchMember,
  fetchByQueryMember,
  addMember,
  createNote,
  updateNote,
  deleteNote,
  getLatest,
};
