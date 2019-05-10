// @flow

import { API_URI, getAuth, postAuth } from '../http';

export async function fetchAll() {
  return getAuth(`${API_URI}/subscription/billing-plan/`);
}

export async function createFromPack(data: *) {
  return postAuth(
    `${API_URI}/subscription/billing-plan/create_from_pack/`,
    data,
  );
}

export default {
  fetchAll,
  createFromPack,
};
