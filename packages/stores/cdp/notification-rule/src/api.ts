import { type ApiConfig } from "@bsport/store-base";

const API_URL = "customer-data-platform/v1/notification/rule";

export const fetchCommunicationVariablesAPI = (): ApiConfig => {
  return [`${API_URL}/tags/`];
};
