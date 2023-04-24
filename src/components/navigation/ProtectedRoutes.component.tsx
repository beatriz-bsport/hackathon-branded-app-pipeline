// @ts-nocheck
import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

// import { Redirect, useLocation } from 'react-router';
import { compose } from 'recompose';

import { getPermissions } from '#libs/role/selectors';
import { RootState } from '../../reducers';
// import Config from '../../config';
// import { UPSELL_PERFORMANCE_TRACKING_IDENTIFIER } from '#libs/platform-billing/upsell-identifiers';
// import { URLS_PERMISSIONS, URLS_UPSELL } from '#libs/role/constants';
// import { checkRequiredPermissionsForPath } from '#libs/role/utils';

const ProtectedRoutes: React.FC<ConnectedProps<typeof connector>> = ({
  // permissions,
  // companyId,
  // featureList,
  children,
}) => {
  return <>{children}</>;
  /*
  const hasUpsellIdentifier = useCallback(
    (identifier: number) =>
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      featureList.map((ups) => ups.upsell_identifier).includes(identifier),
    [featureList],
  );
  const location = useLocation();

  const isAuthorized = useCallback(
    (path) => {
      const genericPathWithTrailingSlash = path.split(/\/[0-9]/)?.[0];
      const genericPath = genericPathWithTrailingSlash.replace(/\/$/, '');

      // if it's not in the config  their is no restriction
      if (!URLS_PERMISSIONS[genericPath]) return true;
      const hasAtLeastOnePerm = checkRequiredPermissionsForPath(
        genericPath,
        permissions,
      );

      const upsellNeeded: number | false = URLS_UPSELL[genericPath] ?? false;

      if (!upsellNeeded) {
        return hasAtLeastOnePerm;
      }

      if (
        upsellNeeded === UPSELL_PERFORMANCE_TRACKING_IDENTIFIER &&
        [634, 631, 632, 633, 630].includes(companyId)
      ) {
        return hasAtLeastOnePerm;
      }

      const hasUpsell = hasUpsellIdentifier(upsellNeeded);

      return hasAtLeastOnePerm && hasUpsell;
    },
    [companyId, hasUpsellIdentifier, permissions],
  );

  if (!isAuthorized(location.pathname)) {
    const to =
      Object.keys(URLS_PERMISSIONS).find((url) =>
        checkRequiredPermissionsForPath(url, permissions),
      ) ?? '/empty';
    return <Redirect to={to} />;
  }

  return <>{children}</>;
  */
};

const connector = connect(
  (state: RootState) => ({
    permissions: getPermissions(state),
    featureList: state.company.feature.data.upsell,
    companyId: state.theme.theme.company,
  }),
  {},
);

export default compose(connector)(ProtectedRoutes);
