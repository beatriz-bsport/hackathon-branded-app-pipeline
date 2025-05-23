import { type ApiConfig } from "@bsport/store-base";

const API_URL = "platform/v1";

export const fetchBackgroundTaskAPI = ({
  uuid,
}: {
  uuid: string;
}): ApiConfig => {
  return [`${API_URL}/background_task/${uuid}/`];
};
