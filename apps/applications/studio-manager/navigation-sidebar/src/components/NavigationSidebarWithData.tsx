import { useEffect, useState } from "react";

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

export const NavigationSidebarWithData: React.FC<NavigationSidebarProps> = (
  props,
) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const performFetch = async () => {
      try {
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
    <FeatureFlagsProvider>
      <ErrorBoundaryWrapper
        appName={__NAVIGATION_SIDEBAR__.__SENTRY_SCOPE_TAG__}
      >
        <NavigationSidebar {...props} isLoadingData={isLoading} />
      </ErrorBoundaryWrapper>
    </FeatureFlagsProvider>
  );
};
