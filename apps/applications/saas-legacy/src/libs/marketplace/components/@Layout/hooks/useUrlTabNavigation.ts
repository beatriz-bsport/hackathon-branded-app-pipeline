import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import type { PageTabs } from '#src/libs/marketplace/components/@Layout/HeaderLayout';

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

export const useUrlTabNavigation = (tabs: PageTabs) => {
  const history = useHistory();
  const location = useLocation();

  const tabUrlPaths = tabs.map((tab) => tab.urlPath);

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const tabName = queryParams.get('tabName');

  // Checks if the tabName exists in the tabUrlPaths array, and if so, returns the corresponding selected tab
  // If not, default to the first tab
  const selectedTab = useMemo(() => {
    return tabs.find((tab) => tab.urlPath === tabName) ?? tabs[0];
  }, [tabName, tabs]);

  // If the tabName is invalid or missing, redirect to the first valid tab
  if (!tabName || !tabUrlPaths.includes(tabName)) {
    queryParams.set('tabName', selectedTab.urlPath);
    history.push({
      search: queryParams.toString(),
    });
  }

  const handleTabClick = useCallback(
    (urlPath: string) => () => {
      if (urlPath !== selectedTab.urlPath) {
        queryParams.set('tabName', urlPath);
        history.push({
          search: queryParams.toString(),
        });
      }
    },
    [selectedTab, history, queryParams],
  );

  return { handleTabClick, selectedTab };
};
