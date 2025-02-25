import React from 'react';
// eslint-disable-next-line
import { connect, ConnectedProps } from 'react-redux';
import { getObjectPermissions } from '#src/libs/role/selectors';
import { RootState } from '../../../reducers';
import { hasObjectLevelPermission } from './utils';

type OwnProps =
  | {
      requiredPermission: string;
      children: (hasPermission: boolean) => React.ReactNode;
    }
  | {
      requiredPermission: string[];
      children: (hasPermission: boolean[]) => React.ReactNode;
    };

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
    // @ts-expect-error TS can not detect that this particular children only accepts boolean[]
    return <>{children(hasPermissionArray)}</>;
  }

  const hasPermission = hasObjectLevelPermission(
    objectPermissions,
    requiredPermission,
  );
  // @ts-expect-error TS can not detect that this particular children only accepts boolean
  return <>{children(hasPermission)}</>;
};

const connector = connect(
  (state: RootState) => ({
    objectPermissions: getObjectPermissions(state),
  }),
  {},
);

export default React.memo(connector(ObjectLevelPermissionProvider));
