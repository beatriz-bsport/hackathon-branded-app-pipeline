import React from 'react';

export const ConditionalWrapper = ({
  className,
  condition,
  wrapper,
  children,
  WrapperComponent,
}: {
  className?: string;
  condition: boolean;
  wrapper?: (children: React.ReactElement) => React.ReactElement;
  WrapperComponent?: React.FC<{ className?: string }>;
  children: React.ReactElement;
}) => {
  if (condition && wrapper) {
    return wrapper(children);
  }
  if (condition && WrapperComponent) {
    return (
      <WrapperComponent className={className}>{children}</WrapperComponent>
    );
  }
  return children;
};

export default ConditionalWrapper;
