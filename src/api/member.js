import { API_URI, getAuth, postAuth } from '../http';

export async function fetchAllMembers() {
  return getAuth(`${API_URI}/saas/members`);
}

export async function fetchMember(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}`);
}

export async function addMember(data) {
  return postAuth(`${API_URI}/saas/create-member/`, data);
}

export default {
  fetchAll: fetchAllMembers,
  fetchMember,
  addMember,
};
