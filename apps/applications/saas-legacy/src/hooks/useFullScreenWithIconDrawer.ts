import React from 'react';
import { useLocation } from 'react-router';

type MinimizedDrawerParameters = {
  fullPagePathRegExp: string;
  ignoredPathsForAppbar?: string[];
  forceFullDrawer: boolean;
  initialDrawerIconsOnly: boolean;
};

function usePrevious<T = Location>(value: T) {
  const [previousValue, setPreviousValue] = React.useState(value);

  React.useEffect(() => {
    setPreviousValue(value);
  }, [value]);

  return previousValue;
}

/**
 * Generic hook to minimize the left menu drawer and hide the app bar in some specific pages.
 *
 * @remarks
 * This component is used in BackofficeDrawer.component
 *
 * @example
 * useFullScreenWithIconDrawer({
 *  fullPagePathRegExp: "^/audience/.*",
 *  ignoredPathsForAppbar: ["/audience/wip"],
 *  forceFullDrawer: !displayLeftMenu || mobileOpen,
 *  initialDrawerIconsOnly: displayLeftMenu && shrinkResponsiveDrawer,
 * })
 *
 * @param {string} fullPagePathRegExp - Regular expression defining the page path where fullscreen mode is desired, with a minimized drawer and no app bar.
 * @param {string[]} ignoredPathsForAppbar - List of regular expression defining the page paths where the app bar should always be displayed.
 * @param {boolean} forceFullDrawer - True to force the left menu drawer with its full size.
 * @param {boolean} initialDrawerIconsOnly - Initial value of drawerIconsOnly.
 */
export const useFullScreenWithIconDrawer = ({
  fullPagePathRegExp,
  ignoredPathsForAppbar,
  forceFullDrawer,
  initialDrawerIconsOnly,
}: MinimizedDrawerParameters) => {
  const [hideAppBar, setHideAppBar] = React.useState(false);
  const [drawerIconsOnly, setDrawerIconsOnly] = React.useState(
    initialDrawerIconsOnly,
  );

  const location = useLocation();
  const previousLocation = usePrevious(location);

  const LOCATION_IS_AN_IGNORED_PATH_FOR_APPBAR = React.useMemo(
    () =>
      (ignoredPathsForAppbar ?? []).some(
        (path) => path === location?.pathname,
      ) ?? false,
    [ignoredPathsForAppbar, location?.pathname],
  );

  const PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH_FOR_APPBAR = React.useMemo(
    () =>
      (ignoredPathsForAppbar ?? []).some(
        (path) => path === previousLocation?.pathname,
      ) ?? false,
    [ignoredPathsForAppbar, previousLocation?.pathname],
  );

  const LOCATION_IS_PAGE_TARGETED_FOR_FULL_SCREEN = React.useMemo(
    () => RegExp(fullPagePathRegExp).test(location?.pathname),
    [location?.pathname, fullPagePathRegExp],
  );

  const PREVIOUS_LOCATION_WAS_PAGE_TARGETED_FOR_FULL_SCREEN = React.useMemo(
    () => RegExp(fullPagePathRegExp).test(previousLocation?.pathname),
    [fullPagePathRegExp, previousLocation?.pathname],
  );

  React.useEffect(() => {
    if (LOCATION_IS_PAGE_TARGETED_FOR_FULL_SCREEN) {
      setDrawerIconsOnly(true);
      !LOCATION_IS_AN_IGNORED_PATH_FOR_APPBAR && setHideAppBar(true);
      PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH_FOR_APPBAR && setHideAppBar(false);
    } else {
      setHideAppBar(false);
      PREVIOUS_LOCATION_WAS_PAGE_TARGETED_FOR_FULL_SCREEN &&
        setDrawerIconsOnly(false);
    }

    if (forceFullDrawer) {
      setDrawerIconsOnly(false);
    }
  }, [
    LOCATION_IS_AN_IGNORED_PATH_FOR_APPBAR,
    LOCATION_IS_PAGE_TARGETED_FOR_FULL_SCREEN,
    PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH_FOR_APPBAR,
    PREVIOUS_LOCATION_WAS_PAGE_TARGETED_FOR_FULL_SCREEN,
    forceFullDrawer,
  ]);

  return { drawerIconsOnly, hideAppBar, setDrawerIconsOnly };
};
