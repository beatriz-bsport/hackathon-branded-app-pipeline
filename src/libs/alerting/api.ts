import { API_URI, getAuth, postAuth, deleteAuth } from '../../http';

const PAGE_SIZE = 10;

const fetch = async (alert_kind: number, page: number) => {
  return getAuth(
    `${API_URI}/alerts/${alert_kind}/?page=${page}&page_size=${PAGE_SIZE}`,
  );
};

const deleteAlert = async (alert_kind: number, id: number) => {
  if (id === -1) {
    return postAuth(`${API_URI}/alerts/${alert_kind}/flag_all_as_viewed/`);
  }
  return postAuth(`${API_URI}/alerts/${alert_kind}/${id}/flag_as_viewed/`);
};

const delete_ = async (id: number) => {
  return deleteAuth(`${API_URI}/alerts/${id}/`);
};

export default {
  fetch,
  delete_,
  deleteAlert,
};
