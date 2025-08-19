import type { DashboardType, PresignedUrlResponse } from "#src/types/api";
import { fetch } from "#src/utils/fetch";

// Based on the legacy API pattern from saas-legacy
const getApiBaseUrl = () => {
  // In studio manager apps, we'll use relative paths to let the browser handle the correct base URL
  // This follows the pattern used in other studio manager applications
  return "api/v1";
};

export const fetchPresignedUrl = async (
  dashboardType: DashboardType,
): Promise<PresignedUrlResponse> => {
  const apiUrl = `${getApiBaseUrl()}/embedded_analytics/presigned_url/?dashboard_type=${dashboardType}`;

  // @bsport/fetch handles error responses by throwing HTTPException
  // and automatically parses JSON response, so we just get the data
  const response = await fetch<PresignedUrlResponse>(apiUrl);

  return response.data;
};
