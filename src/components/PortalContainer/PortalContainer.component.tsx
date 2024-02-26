import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import { CSSTransition } from 'react-transition-group';

type SlidingContainerProps = {
  isOpen: boolean,
  containerFirstChild: HTMLElement,
  usePostMessageIframeDimensions?: boolean,
};
export const SlidingContainer: React.FC<SlidingContainerProps> = ({
  isOpen,
  children,
  containerFirstChild,
}) => {
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    if (isOpen) {
      containerFirstChild?.style?.setProperty('height', '0px');
      containerFirstChild?.style?.setProperty('display', 'none', 'important');
      nodeRef?.current?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
    return () => {
      setTimeout(() => {
        containerFirstChild?.style?.setProperty('height', '');
        containerFirstChild?.style?.setProperty('display', '');
      }, 200);
    };
  }, [isOpen, containerFirstChild]);

  return (
    <CSSTransition
      unmountOnExit
      classNames="sliding-container"
      in={isOpen}
      nodeRef={nodeRef}
      timeout={300}
    >
      <div ref={nodeRef} className="sliding-container">
        {children}
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
      containerSetUpVariable?.style?.setProperty('height', '100%');
      containerSetUpVariable?.style?.setProperty('width', '100%');
    }
  }

  // Render the sliding container using ReactDOM.createPortal
  return ReactDOM.createPortal(
    <SlidingContainer
      isOpen={isOpen}
      containerFirstChild={containerSetUpVariableFirstChild}
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
> = ({ isOpen, children, parentElement, usePostMessageIframeDimensions }) => {
  React.useEffect(() => {
    window?.addEventListener('message', parentResizer);

    return () => window?.removeEventListener('message', parentResizer);
  }, []);

  const parentResizer = (event: MessageEvent) => {
    if (
      event?.data?.type === 'bsport-widget-resize' &&
      event?.data?.data?.parentElementId === parentElement
    ) {
      const parentElementDiv = document.getElementById(parentElement);

      const elementsWithClassName = parentElementDiv?.getElementsByClassName(
        'sliding-container',
      );

      // Check if there's at least one element with the specified class
      if (elementsWithClassName.length > 0) {
        // Access the first element with the class name "sliding-container"
        const firstChildWithClassName = elementsWithClassName[0];
        if (usePostMessageIframeDimensions) {
          firstChildWithClassName?.style?.setProperty(
            'height',
            `${event?.data?.data.scrollHeight}px`,
          );
        }
      }
    }
  };
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
