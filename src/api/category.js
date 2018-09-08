import { API_URI, getAuth } from '../http';

export async function fetchEasyAccesses() {
  return getAuth(`${API_URI}/category/easy-accesses`);
}

export async function fetchSCT() {
  return getAuth(`${API_URI}/category/SCT`);
}

export default {
  fetchSCT,
  fetchEasyAccesses,
};
