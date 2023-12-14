import React from 'react';

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
  WrapperComponent,
}: {
  condition: boolean;
  wrapper?: (children: React.ReactElement) => React.ReactElement;
  WrapperComponent?: React.FC;
  children: React.ReactElement;
}) => {
  if (condition && wrapper) {
    return wrapper(children);
  }
  if (condition && WrapperComponent) {
    return <WrapperComponent>{children}</WrapperComponent>;
  }
  return children;
};

export default ConditionalWrapper;
