import type { DashboardType, PresignedUrlResponse } from "#src/types/api";
import { fetch } from "#src/utils/fetch";

/**
 * Get the base URL for the API endpoints
 */
const getApiBaseUrl = () => {
  // In studio manager apps, we use relative paths to let the browser handle the correct base URL
  return "api/v1";
};

/**
 * Fetch presigned URL for embedding a dashboard
 * @param dashboardType - The type of dashboard to fetch URL for
 * @returns Promise with the presigned URL response
 */
export const fetchPresignedUrl = async (
  dashboardType: DashboardType,
): Promise<PresignedUrlResponse> => {
  const apiUrl = `${getApiBaseUrl()}/embedded_analytics/presigned_url/?dashboard_type=${dashboardType}`;

  // @bsport/fetch handles error responses by throwing HTTPException
  // and automatically parses JSON response, so we just get the data
  const response = await fetch<PresignedUrlResponse>(apiUrl);

  return response.data;
};
