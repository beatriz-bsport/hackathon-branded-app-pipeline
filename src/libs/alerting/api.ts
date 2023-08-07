import { StatusCode } from '@bsport/common/lib/master-data/planned-invoice-status';
import { API_URI, getAuth, postAuth } from '../../http';
import { PaginatedResponse } from '../../state/types';
import { Alerting } from './types';

const PAGE_SIZE = 10;

const fetch = async (alert_kind: number, page: number) => {
  return getAuth<PaginatedResponse<Alerting>>(
    `${API_URI}/alerts/${alert_kind}/?page=${page}&page_size=${PAGE_SIZE}`,
  );
};

const deleteAlert = async (alert_kind: number, id: number) => {
  if (id === -1) {
    return postAuth<StatusCode>(
      `${API_URI}/alerts/${alert_kind}/flag_all_as_viewed/`,
    );
  }
  return postAuth<StatusCode>(
    `${API_URI}/alerts/${alert_kind}/${id}/flag_as_viewed/`,
  );
};
export default {
  fetch,
  deleteAlert,
};
