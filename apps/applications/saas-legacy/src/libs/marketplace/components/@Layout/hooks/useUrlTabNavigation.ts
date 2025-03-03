import { useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import type { PageTabs } from '#src/libs/marketplace/components/@Layout/HeaderLayout';
import { urlToMarketplaceTab } from '#src/libs/marketplace/utils';

/**
 * A custom hook to manage tab navigation based on the URL.
 * It ensures that the current tab in the URL is valid and provides a function to update the URL when a tab is clicked.
 * If the current tab in the URL is invalid, it automatically redirects to the first valid tab.
 *
 * @param tabs - An array of tab objects containing `label` and `urlPath` properties.
 * @returns An object containing:
 *   - `selectedTab`: The currently selected tab (validated or defaulted to the first tab).
 *   - `handleTabClick`: A function to handle tab clicks and update the URL.
 */

// Temporary assignation of "new-pass" during development, since subcomponent is not available in the current route
export const useUrlTabNavigation = (tabs: PageTabs) => {
  const history = useHistory();
  const {
    companyName,
    companyId,
    tabName,
    subcomponent = 'new-pass',
  } = useParams<{
    companyName: string;
    companyId: string;
    subcomponent: string;
    tabName: string;
  }>();

  const tabUrlPaths = tabs.map((tab) => tab.urlPath);

  const basePath = urlToMarketplaceTab(companyName, companyId, subcomponent);

  // Check if the tabName exists in the tabUrlPaths array, and if so, return the corresponding selected tab
  // If not, default to the first tab
  const selectedTab = useMemo(() => {
    return tabs.find((tab) => tab.urlPath === `/${tabName}`) ?? tabs[0];
  }, [tabName, tabUrlPaths, tabs]);

  // If the tabName is invalid or missing, redirect to the first valid tab
  if (!tabName || !tabUrlPaths.includes(`/${tabName}`)) {
    history.replace(`${basePath}${selectedTab.urlPath}`);
  }

  const handleTabClick = useCallback(
    (urlPath: string) => () => {
      if (urlPath !== selectedTab.urlPath) {
        history.push(`${basePath}${urlPath}`);
      }
    },
    [selectedTab, history, basePath],
  );

  return { handleTabClick, selectedTab };
};
