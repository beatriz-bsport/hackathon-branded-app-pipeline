// @flow

import { API_URI, deleteAuth, getAuth, postAuth } from '../../http';

const fetchAll = async (
  page: number,
  page_size: number,
  queryParams: ?string = '',
) => {
  return getAuth(
    `${API_URI}/subscription/billing-plan/?page_size=${page_size}&page=${page}${
      queryParams ? `&${queryParams}` : ''
    }`,
  );
};

const fetchDetail = async (id: number) => {
  return getAuth(`${API_URI}/subscription/billing-plan/${id}/`);
};

const createFromPack = async (data: *) => {
  return postAuth(
    `${API_URI}/subscription/billing-plan/create_from_pack/`,
    data,
  );
};

const stop = async (id: number) => {
  return deleteAuth(`${API_URI}/subscription/billing-plan/${id}/stop/`);
};

export default {
  fetchAll,
  fetchDetail,
  createFromPack,
  stop,
};
