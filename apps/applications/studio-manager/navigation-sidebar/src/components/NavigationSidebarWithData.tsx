import { useEffect } from "react";

import {
  ErrorBoundaryWrapper,
  fetchSharedDataAction,
} from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";

import NavigationSidebar, {
  type NavigationSidebarProps,
} from "./NavigationSidebar";

const fetchShareData = fetchSharedDataAction.bind(null, fetch);

export const NavigationSidebarWithData: React.FC<NavigationSidebarProps> = (
  props,
) => {
  useEffect(() => {
    try {
      fetchShareData();
    } catch (error) {
      console.error("Failed to fetch shared data:", error);
    }
  }, []);

  return (
    <ErrorBoundaryWrapper appName={__NAVIGATION_SIDEBAR__.__SENTRY_SCOPE_TAG__}>
      <NavigationSidebar {...props} />
    </ErrorBoundaryWrapper>
  );
};
