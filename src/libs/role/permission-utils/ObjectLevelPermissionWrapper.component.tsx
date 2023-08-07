import React from 'react';
// eslint-disable-next-line
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../../reducers';
import { getObjectPermissions } from '#libs/role/selectors';
import { hasObjectLevelPermission } from './utils';

interface OwnProps {
  requiredPermission: string;
  forcedBehavior?: 'disabled' | 'hidden';
  disabledPropName?: string;
  children: React.ReactNode;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const ObjectLevelPermissionWrapper: React.FC<Props> = ({
  objectPermissions,
  requiredPermission,
  forcedBehavior = 'disabled',
  disabledPropName = 'disabled',
  children,
}) => {
  const hasPermission = hasObjectLevelPermission(
    objectPermissions,
    requiredPermission,
  );

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
