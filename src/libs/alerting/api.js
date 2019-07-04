// @flow

import { API_URI, getAuth, postAuth, deleteAuth } from '../../http';

const fetchAll = async () => {
  return getAuth(`${API_URI}/alerts/`);
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
  fetchAll,
  performAction,
  delete_,
};
