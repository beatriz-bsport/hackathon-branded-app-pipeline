import React from 'react';

import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import BottomDrawer from '#Fabrique/BottomDrawer';
import { CONSUMER_SPACE_MODAL_TO_DRAWER_BREAKPOINT } from '#src/libs/consumer-space/constants';

type Props = {
  /** Content to display inside the mobile drawer / modal window */
  children: React.ReactElement;
  /** Name of the pass being removed */
  isOpen: boolean;
  /** Handler function fired when closing the modal / drawer */
  onClose: () => void;
  maxWidth: Breakpoint;
};

const ModalToDrawerSwitcher: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  maxWidth,
}) => {
  const { width } = useViewport();

  const isMobile: boolean = width < CONSUMER_SPACE_MODAL_TO_DRAWER_BREAKPOINT;

  return isMobile ? (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: onClose }}
      className="bs-consumer-booking-spot-scheduling-drawer__root"
    >
      <div className="bs-setup-variable">{children}</div>
    </BottomDrawer>
  ) : (
    <GenericResponsiveDialog
      fullScreenBreakpoint="xs"
      maxWidth={maxWidth}
      onClose={onClose}
      open={isOpen}
    >
      <div className="bs-setup-variable">{children}</div>
    </GenericResponsiveDialog>
  );
};

export default React.memo(ModalToDrawerSwitcher);
