import React from 'react';
import { useLocation } from 'react-router';

type MinimizedDrawerParameters = {
  onEnter: string;
  ignoredPaths?: string[];
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
 *  onEnter: "^/cadence/.*",
 *  ignoredPaths: ["/cadence/wip"],
 *  forceFullDrawer: !displayLeftMenu || mobileOpen,
 *  initialDrawerIconsOnly: displayLeftMenu && shrinkResponsiveDrawer,
 * })
 *
 * @param {string} onEnter - The path of the page where we want the drawer to be minimized.
 * @param {string[]} ignoredPaths - Paths that might be considered as the targeted page but should be ignored.
 * @param {boolean} forceFullDrawer - True to force the left menu drawer with its full size.
 * @param {boolean} initialDrawerIconsOnly - Initial value of drawerIconsOnly.
 */
export const useFullScreenWithIconDrawer = ({
  onEnter,
  ignoredPaths,
  forceFullDrawer,
  initialDrawerIconsOnly,
}: MinimizedDrawerParameters) => {
  const [hideAppBar, setHideAppBar] = React.useState(false);
  const [drawerIconsOnly, setDrawerIconsOnly] = React.useState(
    initialDrawerIconsOnly,
  );

  const location = useLocation();
  const previousLocation = usePrevious(location);

  const LOCATION_IS_AN_IGNORED_PATH = React.useMemo(
    () =>
      (ignoredPaths ?? []).some((path) => path === location?.pathname) ?? false,
    [ignoredPaths, location?.pathname],
  );

  const PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH = React.useMemo(
    () =>
      (ignoredPaths ?? []).some(
        (path) => path === previousLocation?.pathname,
      ) ?? false,
    [ignoredPaths, previousLocation?.pathname],
  );

  const LOCATION_IS_PAGE_TARGETED = React.useMemo(
    () =>
      RegExp(onEnter).test(location?.pathname) && !LOCATION_IS_AN_IGNORED_PATH,
    [LOCATION_IS_AN_IGNORED_PATH, location?.pathname, onEnter],
  );

  const PREVIOUS_LOCATION_WAS_PAGE_TARGETED = React.useMemo(
    () =>
      RegExp(onEnter).test(previousLocation?.pathname) &&
      !PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH,
    [
      PREVIOUS_LOCATION_WAS_AN_IGNORED_PATH,
      onEnter,
      previousLocation?.pathname,
    ],
  );

  React.useEffect(() => {
    if (LOCATION_IS_PAGE_TARGETED) {
      setDrawerIconsOnly(true);
      setHideAppBar(true);
    } else {
      setHideAppBar(false);
      PREVIOUS_LOCATION_WAS_PAGE_TARGETED && setDrawerIconsOnly(false);
    }

    if (forceFullDrawer) {
      setDrawerIconsOnly(false);
    }
  }, [
    LOCATION_IS_PAGE_TARGETED,
    PREVIOUS_LOCATION_WAS_PAGE_TARGETED,
    forceFullDrawer,
  ]);

  return { drawerIconsOnly, hideAppBar, setDrawerIconsOnly };
};
