// @flow

import { API_V1_URI, getAuth, patchAuth } from '../../http.ts';

const fetchCashBook = async (companyId: number) => {
  return getAuth(`${API_V1_URI}/cashbook/cashbook/${companyId}/`);
};

const updateCashBook = async (data: any) => {
  return patchAuth(`${API_V1_URI}/cashbook/cashbook/edit/`, data);
};

export default {
  fetchCashBook,
  updateCashBook,
};
