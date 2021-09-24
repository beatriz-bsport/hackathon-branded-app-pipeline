// @flow
import { AxiosResponse } from 'axios';
import {
  API_URI,
  getAuth,
  patchAuth,
  deleteAuth,
  postAuth,
  post,
  putAuth,
  API_V1_URI,
  buildUrlParams,
} from '../../http';
import { GenericPaginationResults } from '../types';
import { MemberMinimal } from './types';

const PAGE_SIZE = 300;

export async function fetchMemberList(params: {
  page?: number;
  page_size?: number;
  tags_excluded?: Array<number>;
  tags_included?: Array<number>;
  barcode?: string;
  id__in?: Array<number>;
  company?: number;
}): Promise<AxiosResponse<GenericPaginationResults<MemberMinimal>>> {
  return getAuth(
    `${API_V1_URI}/member/${buildUrlParams({
      page_size: PAGE_SIZE,
      ...params,
    })}`,
  );
}

export const fetchFilteredMembers = fetchMemberList;

export async function search(text: string) {
  return postAuth(`${API_V1_URI}/member/search/`, { text });
}

export async function tag(memberId: number, tagId: number) {
  return postAuth(`${API_V1_URI}/member/${memberId}/tag/`, {
    tag: tagId,
  });
}

export async function untag(memberId: number, tagId: number) {
  return deleteAuth(`${API_V1_URI}/member/${memberId}/tag/`, {
    tag: tagId,
  });
}

export const tagAll = async (tagId: number) => {
  return postAuth(`${API_V1_URI}/member/tag_all/`, {
    tag: tagId,
  });
};

export async function untagAll(tagId: number) {
  return deleteAuth(`${API_V1_URI}/member/tag_all/`, {
    tag: tagId,
  });
}

export async function fetchMember(memberId: number) {
  return getAuth(`${API_V1_URI}/member/${memberId}/`);
}

export async function fetchCountObject(memberId: number) {
  return getAuth(`${API_V1_URI}/member/${memberId}/count_objects/`);
}

export async function getLatest() {
  return getAuth(`${API_V1_URI}/member/latest/`);
}

export async function addMember(data: Object) {
  return postAuth(`${API_URI}/saas/create-member/`, data);
}

export async function linkMeToCompany(data: any) {
  return postAuth(`${API_V1_URI}/member/link_to_company/`, data);
}

export async function updateMember(data: any) {
  return putAuth(`${API_V1_URI}/member/${data.get('id')}/`, data);
}

export async function fetchMyUserProfileAPI() {
  return getAuth(`${API_V1_URI}/member/me/`);
}

export async function merge(src: number, dst: number) {
  return postAuth(`${API_V1_URI}/member/merge/`, { src, dst });
}

export async function postUnsubscribe(unsubscribe_uuid: string) {
  return post(`${API_V1_URI}/member/unsubscribe/`, { unsubscribe_uuid });
}

export async function regularizeDebt(memberId: number, data: any) {
  return post(`${API_V1_URI}/member/${memberId}/regularize_debt/`, data);
}

export async function fetchCommunicationsPaginatedMembers(
  params: any,
  id__in = [] as any[],
) {
  const urlParams = buildUrlParams(params);
  return postAuth(
    `${API_V1_URI}/member/members_for_communication/${urlParams}`,
    { id__in },
  );
}

export async function createNote(
  id: number,
  text: string,
  memberId: number,
  highlighted: boolean,
  is_medical: boolean,
) {
  return postAuth(`${API_V1_URI}/member_note/${memberId}/`, {
    text,
    member: memberId,
    highlighted,
    is_medical,
  });
}
export async function updateNote(
  id: number,
  text: string,
  memberId: number,
  highlighted: boolean,
  is_medical: boolean,
) {
  return patchAuth(`${API_V1_URI}/member_note/${id}/`, {
    text,
    highlighted,
    is_medical,
  });
}
export async function deleteNote(id: number) {
  return deleteAuth(`${API_V1_URI}/member_note/${id}/`);
}

export async function addFile(fileData: any) {
  return postAuth(`${API_V1_URI}/member_file_upload/`, fileData);
}

export async function removeFile(fileId: number) {
  return deleteAuth(`${API_V1_URI}/member_file_upload/${fileId}`);
}

export async function adjustCreditWithoutPaymentNote(
  memberId: number,
  amount: number,
) {
  return postAuth(`${API_V1_URI}/member/${memberId}/adjust_credit/`, {
    amount,
  });
}

export default {
  updateMember,
  fetchMember,
  addMember,
  createNote,
  updateNote,
  deleteNote,
  getLatest,
  linkMeToCompany,
  addFile,
  removeFile,
};
