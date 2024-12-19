import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import { CSSTransition } from 'react-transition-group';

type SlidingContainerProps = {
  isOpen: boolean,
  containerFirstChild: HTMLElement,
  widgetContainerElement: HTMLElement,
  usePostMessageIframeDimensions?: boolean,
  usePostMessageIfameScrollup?: boolean,
};
export const SlidingContainer: React.FC<SlidingContainerProps> = ({
  isOpen,
  children,
  containerFirstChild,
  widgetContainerElement,
}) => {
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    if (isOpen) {
      containerFirstChild?.style?.setProperty('height', '0px');
      containerFirstChild?.style?.setProperty('display', 'none', 'important');

      const parentWidgetContainerElement =
        widgetContainerElement?.parentElement;

      // /(iPod|iPhone|iPad|Android)/.test(navigator.userAgent)

      const isMobileAgent = !!navigator.userAgent.match(
        /(iPod|iPhone|iPad|Android)/,
      );
      // From here article here will help to understand : http://blog.jonathanargentiero.com/jquery-scrolltop-not-working-on-mobile-devices-iphone-ipad-android-phones/
      if (isMobileAgent) {
        if (parentWidgetContainerElement) {
          const rect = parentWidgetContainerElement?.getBoundingClientRect();
          rect &&
            window.scrollTo(rect.left, rect.top > 100 ? rect.top - 100 : 0);
        } else {
          const rect = widgetContainerElement?.getBoundingClientRect();
          rect && window.scrollTo(rect.left, rect.top);
        }
      } else if (parentWidgetContainerElement) {
        parentWidgetContainerElement?.animate({ scrollTop: 0 });
      } else {
        widgetContainerElement?.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }
    }
    return () => {
      setTimeout(() => {
        containerFirstChild?.style?.setProperty('height', '');
        containerFirstChild?.style?.setProperty('display', '');
      }, 200);
    };
  }, [isOpen, containerFirstChild, widgetContainerElement]);

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
      widgetContainerElement={widgetContainerElement}
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
> = ({
  isOpen,
  children,
  parentElement,
  usePostMessageIframeDimensions,
  usePostMessageIfameScrollup,
}) => {
  React.useEffect(() => {
    window?.addEventListener('message', widgetDimensioner);

    return () => window?.removeEventListener('message', widgetDimensioner);
  }, []);

  const widgetDimensioner = (event: MessageEvent) => {
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
    if (
      event?.data?.type === 'bsport-widget-scrollup' &&
      event?.data?.data?.parentElementId === parentElement
    ) {
      if (isOpen && usePostMessageIfameScrollup) {
        const widgetContainerElement = document.getElementById(parentElement);
        const parentWidgetContainerElement =
          widgetContainerElement?.parentElement;
        const isMobileAgent = !!navigator.userAgent.match(
          /(iPod|iPhone|iPad|Android)/,
        );

        // From here article here will help to understand : http://blog.jonathanargentiero.com/jquery-scrolltop-not-working-on-mobile-devices-iphone-ipad-android-phones/
        if (isMobileAgent) {
          if (parentWidgetContainerElement) {
            const rect = parentWidgetContainerElement?.getBoundingClientRect();
            rect &&
              window.scrollTo(rect.left, rect.top > 100 ? rect.top - 100 : 0);
          } else {
            const rect = widgetContainerElement?.getBoundingClientRect();
            rect && window.scrollTo(rect.left, rect.top);
          }
        } else if (parentWidgetContainerElement) {
          const rect = parentWidgetContainerElement?.getBoundingClientRect();
          rect &&
            window.scrollTo(rect.left, rect.top > 100 ? rect.top - 100 : 0);
        } else {
          const rect = widgetContainerElement?.getBoundingClientRect();
          rect &&
            window.scrollTo(rect.left, rect.top > 100 ? rect.top - 100 : 0);
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
