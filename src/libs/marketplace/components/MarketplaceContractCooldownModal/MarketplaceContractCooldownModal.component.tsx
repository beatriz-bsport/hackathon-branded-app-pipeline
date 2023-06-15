import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';

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

  const { dialogRef, modalRef } = useDialogClickAwayListener({
    onDialogClose,
  });

  return (
    <>
      {isOpen && (
        <div className="bs-contract-cooldown-dialog__backdrop" ref={dialogRef}>
          <div
            className="bs-contract-cooldown-dialog__container"
            ref={modalRef}
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
                type="button"
                onClick={onDialogClose}
              >
                {t('subscription:alreadySubscribed.dialog.validate')}
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
