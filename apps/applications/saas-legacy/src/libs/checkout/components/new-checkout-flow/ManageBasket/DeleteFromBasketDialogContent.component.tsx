import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonBase from '@material-ui/core/ButtonBase';

import Typography from '#Fabrique/Typography';

import './styles.css';

type Props = {
  /** Name of the pass being removed */
  passName: string;
  /** Handler function fired when clicking on the confirm button */
  onConfirm: () => void;
  /** Handler function fired when clicking on blanket or cancel button */
  onClose: () => void;
};

const DeleteFromBasketDialogContent: React.FC<Props> = ({
  passName,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation('booking');

  const modalTitle = t('booking:newBookingModule.removeFromBasket.title');

  const modalMessage = t('booking:newBookingModule.removeFromBasket.message');

  const modalCancelLabel = t(
    'booking:newBookingModule.removeFromBasket.buttons.cancel',
  );

  const modalConfirmLabel = t(
    'booking:newBookingModule.removeFromBasket.buttons.confirm',
  );

  const handleSubmit = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <div className="bs-marketplace-booker-item__remove_modal">
      <div className="bs-marketplace-booker-item__remove_modal_text">
        <Typography className="bs-marketplace-booker-item__remove_modal_title">{`${modalTitle} ${passName}`}</Typography>
        <Typography className="bs-marketplace-booker-item__remove_modal_content">
          {modalMessage}
        </Typography>
      </div>
      <div className="bs-marketplace-booker-item__remove_modal_buttons">
        <ButtonBase
          className="bs-marketplace-booker-item__remove_modal_cancel_button"
          onClick={onClose}
        >
          {modalCancelLabel}
        </ButtonBase>
        <ButtonBase
          className="bs-marketplace-booker-item__remove_modal_confirm_button"
          onClick={handleSubmit}
        >
          {modalConfirmLabel}
        </ButtonBase>
      </div>
    </div>
  );
};

export default React.memo(DeleteFromBasketDialogContent);
