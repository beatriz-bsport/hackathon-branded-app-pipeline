import { StatusCode } from '@bsport/common/lib/master-data/planned-invoice-status.js';
import type { PaginatedResponse } from 'src/state/types';
import { getAuth, postAuth } from '../../http';
import { Alerting } from './types';
import { buildUrlParams } from '../../http/utils';

import Config from '../../config';

const API_URI = Config.REACT_APP_BASE_URI_STAFF_MANAGEMENT_V0;

const PAGE_SIZE = 10;

const fetch = async (
  alert_kind: number,
  page: number,
  invalidateCache: boolean = false,
) => {
  return getAuth<PaginatedResponse<Alerting>>(
    `${API_URI}/alerts/${alert_kind}/${buildUrlParams({
      page,
      page_size: PAGE_SIZE,
      invalidate_cache: invalidateCache,
    })}`,
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
