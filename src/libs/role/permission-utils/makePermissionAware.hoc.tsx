import React from 'react';
import ObjectPermissionWrapper from './ObjectLevelPermissionWrapper.component';

const makeObjectLevelPermissionAware: (
  WrappedComponent: React.ComponentType,
  requiredPermission: string,
  forcedBehavior?: 'disabled' | 'hidden',
  disabledPropName?: string,
) => React.ComponentType = (
  WrappedComponent,
  requiredPermission,
  forcedBehavior = 'disabled',
  disabledPropName = 'disabled',
) => {
  return (props: any) => (
    <ObjectPermissionWrapper
      disabledPropName={disabledPropName}
      forcedBehavior={forcedBehavior}
      requiredPermission={requiredPermission}
    >
      <WrappedComponent {...props} />
    </ObjectPermissionWrapper>
  );
};

export default makeObjectLevelPermissionAware;
