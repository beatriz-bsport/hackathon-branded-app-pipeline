import React from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import type { PortalProps } from '#src/components/css-only/Portals/types';
import { DetachPaymentBottomDrawer, DetachPaymentModal } from '.';

const DetachPaymentPortal: React.FC<PortalProps> = ({
  isMobile,
  isOpen,
  onClose,
  onConfirm,
  cancelLabel,
  confirmLabel,
  title,
  subtitle,
  isLoading,
}) => {
  if (isMobile) {
    return (
      <DetachPaymentBottomDrawer
        confirmLabel={confirmLabel}
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        subtitle={subtitle}
        title={title}
      />
    );
  }
  return (
    <DetachPaymentModal
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      subtitle={subtitle}
      title={title}
    />
  );
};

export const DetachPaymentPortalStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof DetachPaymentPortal>>()(
    DetachPaymentPortal,
  );
export default React.memo(DetachPaymentPortal);
