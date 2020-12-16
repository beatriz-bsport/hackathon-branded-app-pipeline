// @flow

import { API_V1_URI, getAuth } from '../../../http.ts';

export async function fetchAll() {
  return getAuth(
    `${API_V1_URI}/meta-activity/?is_workshop=true&page_size=null`,
  );
}

export default {
  fetchAll,
};
