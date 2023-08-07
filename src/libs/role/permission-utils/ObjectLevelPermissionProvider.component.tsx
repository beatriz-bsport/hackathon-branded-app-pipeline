import React from 'react';
// eslint-disable-next-line
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../reducers';
import { getObjectPermissions } from '#libs/role/selectors';
import { hasObjectLevelPermission } from './utils';

interface OwnProps {
  requiredPermission: string;
  children: (hasPermission: boolean) => React.ReactNode;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const ObjectLevelPermissionProvider: React.FC<Props> = ({
  objectPermissions,
  requiredPermission,
  children,
}) => {
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

export default connector(ObjectLevelPermissionProvider);
