import React from 'react';
import ReactDOM from 'react-dom';

function createWrapperAndAppendToTargetElement(
  wrapperId: string,
  targetElementId: string,
  wrapperClass?: string,
) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  wrapperClass && wrapperElement.setAttribute('class', wrapperClass);
  const targetElement = document.getElementById(targetElementId);
  if (!targetElement) {
    document.body.appendChild(wrapperElement);
  } else {
    targetElement.appendChild(wrapperElement);
  }
  return wrapperElement;
}

// In this file will be contained all the HOC related to modals, popover, etc ...
// TODO: create the sliding container

export type PortalContainerProps = {
  targetElementId?: string;
  wrapperId: string;
  wrapperClass?: string;
  children: React.ReactNode;
};

export const PortalContainer: React.FC<PortalContainerProps> = React.memo(
  ({
    targetElementId = 'bs-setup-derived-variable',
    children,
    wrapperId = 'bs-fabrique-portal-container',
    wrapperClass,
  }) => {
    const [containerElement, setContainerElement] = React.useState<
      Element | DocumentFragment
    >(null);
    React.useLayoutEffect(() => {
      let element = document.getElementById(wrapperId);
      let isElementCreated = false;
      // if element is not found with wrapperId,
      // create and append to targetElementId
      if (!element) {
        isElementCreated = true;
        element = createWrapperAndAppendToTargetElement(
          wrapperId,
          targetElementId,
          wrapperClass,
        );
      }
      setContainerElement(element);
      return () => {
        // We need to ensure that the dynamically added empty div is removed from the DOM when the ReactPortal component is unmounted
        // delete the created element
        if (isElementCreated && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      };
    }, [wrapperId, targetElementId, wrapperClass]);
    // wrapperElement state will be null on the very first render.
    if (containerElement === null) return null;

    return ReactDOM.createPortal(children, containerElement);
  },
);
