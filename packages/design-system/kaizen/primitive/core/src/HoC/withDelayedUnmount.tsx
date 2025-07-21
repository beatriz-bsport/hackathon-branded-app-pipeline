import React, { useEffect, useState } from "react";

interface AnimationHandlerOptions {
  animationDuration?: number; // ms
}

interface AnimationProps {
  isOpen: boolean;
}

interface InjectedProps {
  shouldRender: boolean;
}

function withDelayedUnmount<P extends AnimationProps>(
  WrappedComponent: React.ComponentType<P & InjectedProps>,
  options?: AnimationHandlerOptions,
) {
  const { animationDuration = 300 } = options || {};

  const ComponentWithDelayedUnmount: React.FC<P> = (props) => {
    const { isOpen, ...rest } = props;
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true); // Mount immediately when open
      } else {
        // Delay unmount by animation duration
        const timer = setTimeout(
          () => setShouldRender(false),
          animationDuration,
        );
        return () => clearTimeout(timer);
      }
    }, [isOpen, animationDuration]);

    return (
      <WrappedComponent
        {...(rest as P)}
        isOpen={isOpen}
        shouldRender={shouldRender}
      />
    );
  };

  return ComponentWithDelayedUnmount;
}

export default withDelayedUnmount;
