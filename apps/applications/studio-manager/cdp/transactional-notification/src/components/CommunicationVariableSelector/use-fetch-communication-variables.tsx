import { useEffect } from "react";

import {
  fetchCommunicationVariablesAction,
  selectAllCommunicationVariables,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const fetchCommunicationVariablesBinded =
  fetchCommunicationVariablesAction.bind(null, fetch);

export const useFetchCommunicationVariables = () => {
  const [, fetchCommunicationVariables] = useAsync<
    typeof fetchCommunicationVariablesBinded
  >({
    asyncFn: fetchCommunicationVariablesBinded,
  });

  const communicationVariables = useNotificationRuleStore((state) =>
    selectAllCommunicationVariables(state),
  );

  useEffect(() => {
    fetchCommunicationVariables();
  }, []);

  return {
    communicationVariables,
    fetchCommunicationVariables,
  };
};
