import React from 'react';
// eslint-disable-next-line
import { connect, ConnectedProps } from 'react-redux';
import { getObjectPermissions } from '#libs/role/selectors';
import { RootState } from '../../../reducers';
import { hasObjectLevelPermission } from './utils';

interface OwnProps {
  requiredPermission: string | string[];
  forcedBehavior?: 'disabled' | 'hidden';
  disabledPropName?: string;
  children: React.ReactNode;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

// When providing an array for prop 'requiredPermission', the user
// must have ALL permissions in order to perform the action / see the element.

const ObjectLevelPermissionWrapper: React.FC<Props> = ({
  objectPermissions,
  requiredPermission,
  forcedBehavior = 'disabled',
  disabledPropName = 'disabled',
  children,
}) => {
  let hasPermission: boolean;

  if (Array.isArray(requiredPermission)) {
    hasPermission = requiredPermission.every((permissionString) =>
      hasObjectLevelPermission(objectPermissions, permissionString),
    );
  } else {
    hasPermission = hasObjectLevelPermission(
      objectPermissions,
      requiredPermission,
    );
  }

  if (!hasPermission && forcedBehavior === 'hidden') return null;

  const injectedProps = hasPermission ? {} : { [disabledPropName]: true };

  // Verifies that children has only one child (a React element) and returns it. Otherwise throws an error.
  const childElement = React.Children.only(children) as React.ReactElement<any>;
  const childElementWithInjectedProps = React.cloneElement(
    childElement,
    injectedProps,
  );

  return <>{childElementWithInjectedProps}</>;
};

const connector = connect(
  (state: RootState) => ({
    objectPermissions: getObjectPermissions(state),
  }),
  {},
);

export default connector(ObjectLevelPermissionWrapper);
