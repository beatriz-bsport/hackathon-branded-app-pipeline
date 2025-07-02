import {
  type ApiConfig,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  buildUrlParams,
} from "@bsport/store-base";

import { type AlertKind } from "#src/types";

const API_URL = "staff-management/v0/alerts";

/**
 * Fetch alerts for a specific alert kind with pagination
 */
export const fetchAlertsAPI = (params: {
  alert_kind: AlertKind;
  page?: number;
  page_size?: number;
}): ApiConfig => {
  const { alert_kind, ...queryParams } = params;

  const urlParams = buildUrlParams({
    page: queryParams.page || DEFAULT_PAGE,
    page_size: queryParams.page_size || DEFAULT_PAGE_SIZE,
  });

  return [`${API_URL}/${alert_kind}/${urlParams}`];
};
