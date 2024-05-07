import React from 'react';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { BarcodeModal, BarcodeBottomDrawer } from '.';
import type { BarcodePortalProps } from '#src/components/css-only/Portals/types';

const BarcodePortal: React.FC<BarcodePortalProps> = ({
  barcode,
  isMobile,
  isOpen,
  onClose,
  cancelLabel,
  title,
  subtitle,
}) => {
  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  if (isMobile) {
    return (
      <BarcodeBottomDrawer
        barcode={barcode}
        cancelLabel={cancelLabel}
        isOpen={isOpen}
        onClose={handleClose}
        subtitle={subtitle}
        title={title}
      />
    );
  }
  return (
    <BarcodeModal
      barcode={barcode}
      cancelLabel={cancelLabel}
      isOpen={isOpen}
      onClose={handleClose}
      subtitle={subtitle}
      title={title}
    />
  );
};

export const BarcodePortalStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof BarcodePortal>>()(
    BarcodePortal,
  );
export default React.memo(BarcodePortal);
