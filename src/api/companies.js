// @flow

import { API_URI, getAuth } from '../http';

export async function getCompany() {
  return getAuth(`${API_URI}/companies/`).then((response) => {
    return response.data[0];
  });
}

export default {
  getCompany,
};
