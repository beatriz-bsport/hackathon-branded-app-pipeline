import React from "react";
import ReactDOM from "react-dom";

function createContainerAndAppendToParentElement(
  containerId: string,
  parentId?: string,
  containerClass?: string,
) {
  const containerElement = document.createElement("div");
  containerElement.setAttribute("id", containerId);
  if (containerClass) containerElement.setAttribute("class", containerClass);
  const targetElement = parentId
    ? document.getElementById(parentId)
    : document.body;
  if (!targetElement) {
    document.body.appendChild(containerElement);
  } else {
    targetElement.appendChild(containerElement);
  }
  return containerElement;
}

export type PortalContainerProps = {
  children: React.ReactNode;
  containerId: string;
  containerClass?: string;
  parentId?: string;
};

const PortalContainer: React.FC<PortalContainerProps> = ({
  children,
  containerId = "kz-portal-container",
  containerClass,
  parentId,
}) => {
  const [containerElement, setContainerElement] = React.useState<
    Element | DocumentFragment | null
  >(null);
  React.useLayoutEffect(() => {
    let container = document.getElementById(containerId);
    let isElementCreated = false;
    if (!container) {
      isElementCreated = true;
      container = createContainerAndAppendToParentElement(
        containerId,
        parentId,
        containerClass,
      );
    }
    setContainerElement(container);
    return () => {
      if (isElementCreated && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [parentId, containerId, containerClass]);
  if (containerElement === null) return null;

  return ReactDOM.createPortal(children, containerElement);
};

export default PortalContainer;
