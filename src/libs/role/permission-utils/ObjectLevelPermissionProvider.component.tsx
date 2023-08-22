import React from 'react';
import isEqual from 'lodash/isEqual';
// eslint-disable-next-line
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../reducers';
import { getObjectPermissions } from '#libs/role/selectors';
import { hasObjectLevelPermission } from './utils';

interface OwnProps {
  requiredPermission: string | string[];
  children: (hasPermission: boolean | boolean[]) => React.ReactNode;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

// When providing an array for prop 'requiredPermission', the child function
// takes an array of boolean as an argument.
// Each boolean maps to a single permission based on the array indexes

const ObjectLevelPermissionProvider: React.FC<Props> = ({
  objectPermissions,
  requiredPermission,
  children,
}) => {
  if (Array.isArray(requiredPermission)) {
    const hasPermissionArray = requiredPermission.map((permissionString) =>
      hasObjectLevelPermission(objectPermissions, permissionString),
    );

    return <>{children(hasPermissionArray)}</>;
  }

  const hasPermission = hasObjectLevelPermission(
    objectPermissions,
    requiredPermission,
  );
  return <>{children(hasPermission)}</>;
};

const connector = connect(
  (state: RootState) => ({
    objectPermissions: getObjectPermissions(state),
  }),
  {},
);

export default React.memo(connector(ObjectLevelPermissionProvider), isEqual);
