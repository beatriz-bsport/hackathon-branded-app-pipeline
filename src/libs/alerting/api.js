// @flow

import { API_URI, getAuth, postAuth } from '../../http';

const fetchAll = async () => {
  return getAuth(`${API_URI}/alerts/`);
};

const performAction = async (id: number, action_name: string) => {
  return postAuth(`${API_URI}/alerts/${id}/perform_action/`, {
    action_name,
  });
};

export default {
  fetchAll,
  performAction,
};
