import React from 'react';

import Modal from '@material-ui/core/Modal';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import { CONSUMER_SPACE_MOBILE_BREAKPOINT } from '#src/libs/consumer-space/constants';

type DrawerAnchor = 'top' | 'bottom' | 'left' | 'right';

type Props = {
  /** Content to display inside the mobile drawer / modal window */
  children: React.ReactElement;
  /** custom string to tell from which side the drawer should open */
  drawerAnchor: DrawerAnchor;
  /** Name of the pass being removed */
  isOpen: boolean;
  /** Handler function fired when closing the modal / drawer */
  onClose: () => void;
  /** Handler function fired when opening the modal / drawer*/
  onOpen?: () => void;
};

const ModalToDrawerSwitcher: React.FC<Props> = ({
  children,
  drawerAnchor = 'bottom',
  isOpen,
  onClose,
  onOpen,
}) => {
  const { width } = useViewport();

  const isMobile: boolean = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  return isMobile ? (
    <SwipeableDrawer
      disablePortal
      anchor={drawerAnchor}
      onClose={onClose}
      onOpen={onOpen}
      open={isOpen}
    >
      {children}
    </SwipeableDrawer>
  ) : (
    <Modal disablePortal onClose={onClose} open={isOpen}>
      {children}
    </Modal>
  );
};

export default React.memo(ModalToDrawerSwitcher);
