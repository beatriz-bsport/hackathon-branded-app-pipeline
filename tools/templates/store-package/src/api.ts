import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

/** @indication Replace with your actual API endpoint path */
const API_URL = "your-group/v1/path/to/api";

/**
 * @indication
 * An API returns a list where
 * - the first argument is the final path
 * - the second argument is the params to provide to fetch
 * The method is default to GET.
 */

/** @indication Basic GET method, you can simply provide the final URL */
export const fetchModelsAPI = (params: {
  page: number;
  page_size: number;
}): ApiConfig => {
  return [`${API_URL}/path/to/get/${buildUrlParams(params)}`];
};

/** @indication When using a different HTTP method, you need to provide it in the 2nd arg */
export const updateModelAPI = (params: { data: unknown }): ApiConfig => {
  return [
    `${API_URL}/path/to/update/`,
    {
      method: "PATCH",
      body: JSON.stringify(params),
    },
  ];
};
