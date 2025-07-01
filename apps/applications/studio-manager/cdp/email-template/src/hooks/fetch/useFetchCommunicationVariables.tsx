import {
  type CommunicationVariable,
  fetchCommunicationVariablesAction,
  selectAllCommunicationVariables,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

type UseFetchCommunicationVariablesParams = {
  onSuccess?: (communicationVariables: CommunicationVariable) => void;
  onFailure?: (error: Error) => void;
};

const fetchCommunicationVariablesBinded =
  fetchCommunicationVariablesAction.bind(null, fetch);

export const useFetchCommunicationVariables = (
  options?: UseFetchCommunicationVariablesParams,
) => {
  const [{ isLoading }, fetchCommunicationVariables] = useAsync<
    typeof fetchCommunicationVariablesBinded
  >({
    asyncFn: fetchCommunicationVariablesBinded,
    onSuccess: ({ value }) => options?.onSuccess?.(value),
    onFailure: ({ error }) => options?.onFailure?.(error),
  });

  const communicationVariables = useNotificationRuleStore((state) =>
    selectAllCommunicationVariables(state),
  );

  return {
    isLoading,
    communicationVariables,
    fetchCommunicationVariables,
  };
};
