import React from 'react';
import ObjectLevelPermissionWrapper from './ObjectLevelPermissionWrapper.component';

// When providing an array for argument 'requiredPermission', the user
// must have ALL permissions in order to perform the action / see the element.

const makeObjectLevelPermissionAware: (
  WrappedComponent: React.ComponentType,
  requiredPermission: string | string[],
  forcedBehavior?: 'disabled' | 'hidden',
  disabledPropName?: string,
) => React.ComponentType = (
  WrappedComponent,
  requiredPermission,
  forcedBehavior = 'disabled',
  disabledPropName = 'disabled',
) => {
  return (props: any) => (
    <ObjectLevelPermissionWrapper
      disabledPropName={disabledPropName}
      forcedBehavior={forcedBehavior}
      requiredPermission={requiredPermission}
    >
      <WrappedComponent {...props} />
    </ObjectLevelPermissionWrapper>
  );
};

export default makeObjectLevelPermissionAware;
