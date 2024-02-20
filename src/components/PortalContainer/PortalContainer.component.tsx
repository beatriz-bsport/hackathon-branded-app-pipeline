import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import { CSSTransition } from 'react-transition-group';

type SlidingContainerProps = {
  isOpen: boolean,
  containerSetUpVariable: HTMLElement,
};
export const SlidingContainer: React.FC<SlidingContainerProps> = ({
  isOpen,
  children,
  containerSetUpVariable,
}) => {
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    if (isOpen) {
      nodeRef?.current?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
      containerSetUpVariable?.style?.setProperty('height', '0px');
    }
    return () => {
      setTimeout(() => {
        containerSetUpVariable?.style?.setProperty('height', '');
      }, 200);
    };
  }, [isOpen, containerSetUpVariable]);

  return (
    <CSSTransition
      unmountOnExit
      classNames="sliding-container"
      in={isOpen}
      nodeRef={nodeRef}
      timeout={300}
    >
      <div ref={nodeRef} className="sliding-container">
        <div className="sliding-container-content">{children}</div>
      </div>
    </CSSTransition>
  );
};

type PortalSlidingContainerProps = SlidingContainerProps & {
  containerElementID: string,
  parentElement: string,
  children: Element,
};
export const PortalSlidingContainer: React.FC<PortalSlidingContainerProps> = ({
  isOpen,
  containerElementID,
  parentElement,
  children,
}) => {
  // Get the container element based on the containerElementID
  let containerSetUpVariable: HTMLElement | Element = document.getElementById(
    containerElementID,
  );

  // Get the parent element based on the parentElement ID
  const widgetContainerElement = document.getElementById(parentElement);
  const containerSetUpVariableFirstChild = containerSetUpVariable?.firstChild;
  // Check if the parentElement and widgetContainerElement exist
  if (parentElement && widgetContainerElement) {
    // Find the child container with ID 'bs-setup-derived-variable'
    const childContainerSetUpVariable = widgetContainerElement.querySelector(
      '#bs-setup-derived-variable',
    );

    // If the child container is found, update the containerSetUpVariable
    if (childContainerSetUpVariable) {
      containerSetUpVariable = childContainerSetUpVariable;
    }
  }

  // Render the sliding container using ReactDOM.createPortal
  return ReactDOM.createPortal(
    <SlidingContainer
      isOpen={isOpen}
      containerSetUpVariable={containerSetUpVariableFirstChild}
    >
      {children}
    </SlidingContainer>,
    containerSetUpVariable,
  );
};

// Important component to make absolutly sure that in the widget we insert the container
// at the "highest" possible point which is the div just after where we inject the css variables
export const WidgetPortalSlidingContainer: React.FC<
  SlidingContainerProps & {
    children: React.ReactElement,
    parentElement: string,
  },
> = ({ isOpen, children, parentElement }) => {
  return (
    <PortalSlidingContainer
      parentElement={parentElement}
      containerElementID="bs-setup-derived-variable"
      isOpen={isOpen}
    >
      {children}
    </PortalSlidingContainer>
  );
};
export default React.memo(WidgetPortalSlidingContainer);
