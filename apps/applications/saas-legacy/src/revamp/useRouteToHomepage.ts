import { useCallback } from 'react';
import Config from '#src/config';
import { useSafeFlag, FeatureFlags } from '#src/utils/feature-flag';
import { useShowRevampedSidebar } from './useShowRevampedSidebar';
import { REVAMPED_BO_DOMAIN } from './constants';
import { useLocation } from 'react-router';
import { RoleType } from '@bsport/common/lib/master-data/user-role';

const ALLOWED_ROLES = [
  RoleType.USER_ROLE_NO_RESTRICTION,
  RoleType.USER_ROLE_ADMIN,
  RoleType.USER_ROLE_ONLY_OFFER_MANAGEMENT,
  RoleType.USER_ROLE_ONLY_OFFER_MANAGEMENT_AND_MEMBER,
];

/**
 * Hook to manage redirection to the revamp homepage when the homepage is enabled, as
 * well as the revamped backoffice.
 *
 * @param revampedBoEnabledForUser Whether the revamped BO has been enabled at the user level.
 * @param revampedBoEnabledInTheme Whether the revamped BO has been enabled at the company level.
 * @param role If provided, it checks that the bsport role does not have restricted urls
 *
 * @returns
 * - navigateToHomepage: callback that handles the navigation to the revamp homepage.
 * - shouldNavigateToHomepage: whether to use the callback at root path (/), based on enabled revamp features.
 * - shouldFallbackToHomepage: whether to use the callback as fallback path, based on enabled revamp features.
 *
 * @description
 * On deployed environments, the revamp BO is running on the "/studio/" subdomain.
 * However, in local, the revamp BO is running on a different port.
 *
 * Locally, we can not run the revamp BO (sm-host) and saas-legacy together,
 * As the Navigation Sidebar would have to run in 2 different modes (compat, normal).
 *
 * Thus, to avoid breaking the local development on saas-legacy, we force
 * should***ToHomepage to false.
 */
export const useRouteToHomepage = ({
  revampedBoEnabledForUser,
  revampedBoEnabledInTheme,
  role,
}: {
  revampedBoEnabledForUser: boolean;
  revampedBoEnabledInTheme: boolean;
  role?: number;
}) => {
  const isRevampedBOEnabled = useShowRevampedSidebar({
    enabledForUser: revampedBoEnabledForUser,
    enabledInTheme: revampedBoEnabledInTheme,
  });
  const isHomepageEnabled = useSafeFlag(FeatureFlags.HOMEPAGE);

  const hasRevampFeaturesEnabled = isRevampedBOEnabled && isHomepageEnabled;

  const pathname = useLocation()?.pathname ?? '';
  const isAtRootPath = pathname === '/' || pathname === '';
  // To prevent circular redirection, safeguard (should not happen as /studio/ is a different host)
  const isStudioLocation = pathname.startsWith(REVAMPED_BO_DOMAIN);

  const isLocal = Config.REACT_APP_SENTRY_ENVIRONMENT === 'local';

  // If role is not provided, set to true and let other mechanism handle the permissions check
  // If provided, allow the redirection only for bsport roles that don't have restricted paths
  const hasBOAccess = role ? ALLOWED_ROLES.includes(role) : true;

  return {
    navigateToHomepage: useCallback(() => {
      if (isLocal) {
        // eslint-disable-next-line no-console
        console.info(
          `On deployed environments, navigateToHomepage would have redirected to ${REVAMPED_BO_DOMAIN}/`,
        );
        return null;
      }

      window.location.assign(`${REVAMPED_BO_DOMAIN}/`);
      return null;
    }, [isLocal]),

    shouldNavigateToHomepage:
      hasRevampFeaturesEnabled && !isLocal && isAtRootPath && hasBOAccess,

    shouldFallbackToHomepage:
      hasRevampFeaturesEnabled && !isLocal && !isStudioLocation && hasBOAccess,
  };
};
