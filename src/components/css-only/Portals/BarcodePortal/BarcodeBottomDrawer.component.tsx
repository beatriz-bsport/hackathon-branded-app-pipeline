import React from 'react';
// @ts-expect-error
import BarCode from 'react-barcode';
import BottomDrawer from '#src/components/css-only/Fabrique/BottomDrawer';
import type { BarcodeModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
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
  );
};

export default React.memo(BarcodeBottomDrawer);
