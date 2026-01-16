import { useEffect, useState } from "react";

import { setLocalAPIEnv } from "@bsport/fetch";
import {
  ErrorBoundaryWrapper,
  FeatureFlagsProvider,
  fetchSharedDataAction,
} from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

import NavigationSidebar, {
  type NavigationSidebarProps,
} from "./NavigationSidebar";

const fetchSharedData = fetchSharedDataAction.bind(null, fetch);

/**
 * Export the NavigationSidebar that is used in the Legacy Backoffice,
 * and handles itself the fetch to shared data.
 * In revamp apps, it is handled in the AppWrapper of sm-backbone.
 */
export const NavigationSidebarWithData: React.FC<NavigationSidebarProps> = (
  props,
) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const performFetch = async () => {
      try {
        // In compat mode, set the api env in the window
        setLocalAPIEnv(__API_ENV__);
        await fetchSharedData();
      } catch (error) {
        console.error("Failed to fetch shared data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performFetch();
  }, []);

  return (
    <ErrorBoundaryWrapper appName={__NAVIGATION_SIDEBAR__.__SENTRY_SCOPE_TAG__}>
      <FeatureFlagsProvider>
        <NavigationSidebar {...props} isLoadingData={isLoading} />
      </FeatureFlagsProvider>
    </ErrorBoundaryWrapper>
  );
};
