import { useEffect } from "react";

import {
  fetchGenericCommunicationVariablesAction,
  selectGenericCommunicationVariables,
  useNotificationRuleStore,
} from "@bsport/store-cdp-notification-rule";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

const _fetchGenericCommunicationVariables =
  fetchGenericCommunicationVariablesAction.bind(null, fetch);

/**
 * Hook for fetching generic communication variables used in notification templates.
 * These generic variables can be used to interpolate the notification content so that you can
 * add the real value that will be added to the communications by the template. For example,
 * If you use the variable { company_name } then instead of this variable, the real company name
 * will be added to the communication preview.
 *
 * @returns Object containing loading state, variables data, and fetch function
 */
export const useFetchResolvedGenericCommunicationVariables = () => {
  const [{ isLoading }, fetchGenericCommunicationVariables] = useAsync<
    typeof _fetchGenericCommunicationVariables
  >({
    asyncFn: _fetchGenericCommunicationVariables,
  });

  const genericCommunicationVariables = useNotificationRuleStore((state) =>
    selectGenericCommunicationVariables(state),
  );

  useEffect(() => {
    fetchGenericCommunicationVariables();
  }, []);

  return {
    isLoading,
    genericCommunicationVariables,
    fetchGenericCommunicationVariables,
  };
};
