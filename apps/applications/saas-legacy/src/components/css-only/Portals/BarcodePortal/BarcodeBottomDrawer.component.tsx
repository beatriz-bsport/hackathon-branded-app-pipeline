import React from 'react';
import BarCode from 'react-barcode';
import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import type { BarcodeModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import { PortalContainer } from '#Fabrique/PortalContainer';
import '#src/components/css-only/Portals/styles.css';

const BarcodeBottomDrawer: React.FC<BarcodeModalsAndDrawersProps> = ({
  barcode,
  cancelLabel,
  isOpen,
  onClose,
  subtitle,
  title,
}) => {
  return (
    <PortalContainer wrapperId="bs-barcode-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        className="bs-barcode-drawer__root"
        modalDialogProps={{
          classes: { content: 'bs-portals-modal__content' },
          cancelLabel,
          onClose,
          subtitle,
          title,
        }}
      >
        <BarCode displayValue={false} value={barcode} />
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(BarcodeBottomDrawer);
