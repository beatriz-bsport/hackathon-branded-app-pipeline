import React from 'react';
// @ts-expect-error
import BarCode from 'react-barcode';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import type { BarcodeModalsAndDrawersProps } from '#src/components/css-only/Portals/types';
import '#src/components/css-only/Portals/styles.css';

const BarcodeModal: React.FC<BarcodeModalsAndDrawersProps> = ({
  barcode,
  cancelLabel,
  isOpen,
  onClose,
  subtitle,
  title,
}) => {
  return (
    <PortalContainer wrapperId="bs-barcode-portal-container">
      <Blanket className="bs-portals-blanket" isOpen={isOpen}>
        <ModalDialog
          cancelLabel={cancelLabel}
          classes={{ content: 'bs-portals-modal__content' }}
          className="bs-barcode-modal"
          onCancel={onClose}
          onClose={onClose}
          subtitle={subtitle}
          title={title}
        >
          <BarCode displayValue={false} value={barcode} />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(BarcodeModal);
