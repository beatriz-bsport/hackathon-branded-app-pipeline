import React from 'react';
import ReactDOM from 'react-dom';

import { CSSTransition } from 'react-transition-group';

import './styles.css';

type SlidingContainerProps = {
  isOpen: boolean;
};
export const SlidingContainer: React.FC<SlidingContainerProps> = ({
  isOpen,
  children,
}) => {
  const nodeRef = React.useRef(null);
  React.useEffect(() => {
    isOpen &&
      nodeRef?.current?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
  }, [isOpen]);
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
  containerElementID: string;
  children: React.ReactElement;
};
export const PortalSlidingContainer: React.FC<PortalSlidingContainerProps> = ({
  isOpen,
  containerElementID,
  children,
}) => {
  const containerSetUpVariable = document.getElementById(containerElementID);
  return ReactDOM.createPortal(
    <SlidingContainer isOpen={isOpen}>{children}</SlidingContainer>,
    containerSetUpVariable,
  );
};

// Important component to make absolutly sure that in the widget we insert the container
// at the "highest" possible point which is the div just after where we inject the css variables
export const WidgetPortalSlidingContainer: React.FC<
  SlidingContainerProps & { children: React.ReactElement }
> = ({ isOpen, children }) => {
  return (
    <PortalSlidingContainer
      containerElementID="bs-setup-derived-variable"
      isOpen={isOpen}
    >
      {children}
    </PortalSlidingContainer>
  );
};
export default React.memo(WidgetPortalSlidingContainer);
