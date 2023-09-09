import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';
import { CONTRACT_CHECKOUT_COOLDOWN_MODAL_SECONDS } from '#libs/marketplace/constants';

import './styles.css';

export type Props = {
  isOpen: boolean;
  onDialogClose: () => void;
};

const MarketplaceContractCooldownModal: React.FC<Props> = ({
  isOpen,
  onDialogClose,
}) => {
  const { t } = useTranslation('subscription');
  const [modalCountdown, setModalCountdown] = useState(
    CONTRACT_CHECKOUT_COOLDOWN_MODAL_SECONDS,
  );

  const { dialogRef, modalRef } = useDialogClickAwayListener({
    onDialogClose,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setModalCountdown((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {isOpen && (
        <div ref={dialogRef} className="bs-contract-cooldown-dialog__backdrop">
          <div
            ref={modalRef}
            className="bs-contract-cooldown-dialog__container"
          >
            <h5 className="bs-contract-cooldown-dialog__title">
              {t('subscription:alreadySubscribed.dialog.title')}
            </h5>

            <span className="bs-contract-cooldown-dialog__text">
              {t('subscription:alreadySubscribed.dialog.content')}
            </span>

            <div className="bs-contract-cooldown-dialog__actions">
              <button
                className="bs-contract-cooldown-dialog__button"
                disabled={modalCountdown > 0}
                onClick={onDialogClose}
                type="button"
              >
                {modalCountdown > 0
                  ? modalCountdown
                  : t('subscription:alreadySubscribed.dialog.validate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MarketplaceContractCooldownModalForStorybook = marketplaceCssHoc()(
  MarketplaceContractCooldownModal,
);

export default MarketplaceContractCooldownModal;
