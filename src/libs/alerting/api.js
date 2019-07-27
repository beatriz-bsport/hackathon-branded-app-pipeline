// @flow

import { API_URI, getAuth, postAuth, deleteAuth } from '../../http';

const PAGE_SIZE = 10;

const fetch = async (alert_kind: number, page: number) => {
  return getAuth(
    `${API_URI}/alerts/${alert_kind}/?page=${page}&page_size=${PAGE_SIZE}`,
  );
};

const delete_ = async (id: number) => {
  return deleteAuth(`${API_URI}/alerts/${id}/`);
};

const performAction = async (id: number, action_name: string) => {
  return postAuth(`${API_URI}/alerts/${id}/perform_action/`, {
    action_name,
  });
};

export default {
  fetch,
  performAction,
  delete_,
};
