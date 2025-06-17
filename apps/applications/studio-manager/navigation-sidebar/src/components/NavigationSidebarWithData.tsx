import { useEffect } from "react";

import { fetchSharedDataAction } from "@bsport/sm-backbone";

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

  return <NavigationSidebar {...props} />;
};
