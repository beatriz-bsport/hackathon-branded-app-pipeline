import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { OptionCallback } from '../../../../state/types';
import { downloadDocument } from '../../../../utils/downloader';
import { useDialogClickAwayListener } from '../../../../hooks/useDialogClickAwayListener';

import './styles.css';

export type Props = {
  contractTerms: string;
  isOpen: boolean;
  contractTermsLink?: string;
  onDialogClose: () => void;
  onDownloadTerms: (options?: OptionCallback) => void;
};

const MarketplaceContractTermsModal: React.FC<Props> = ({
  contractTerms,
  isOpen,
  contractTermsLink,
  onDialogClose,
  onDownloadTerms,
}) => {
  const { t } = useTranslation('common');
  const [isProcessing, setIsProcessing] = useState(false);

  const { dialogRef, modalRef } = useDialogClickAwayListener({
    onDialogClose,
  });

  const handleDownloadTerms = useCallback(() => {
    if (contractTermsLink) {
      downloadDocument(contractTermsLink);
      onDialogClose();
    } else {
      setIsProcessing(true);
      onDownloadTerms({
        onSuccess: () => {
          setIsProcessing(false);
          onDialogClose();
        },
        onError: () => {
          setIsProcessing(false);
        },
      });
    }
  }, [onDialogClose, onDownloadTerms, contractTermsLink]);

  return (
    <>
      {isOpen && (
        <div className="bs-contract-terms-dialog__backdrop" ref={dialogRef}>
          <div className="bs-contract-terms-dialog__container" ref={modalRef}>
            <p className="bs-contract-terms-dialog__text">{contractTerms}</p>

            <div className="bs-contract-terms-dialog__actions">
              <button
                className="bs-contract-terms-dialog__button bs-contract-terms-dialog__cancel"
                type="button"
                onClick={onDialogClose}
              >
                {t('common:close')}
              </button>
              <button
                className={classNames('bs-contract-terms-dialog__button', {
                  'bs-contract-terms-dialog__download--disabled': isProcessing,
                  'bs-contract-terms-dialog__download': !isProcessing,
                })}
                type="button"
                disabled={isProcessing}
                onClick={handleDownloadTerms}
              >
                {t('common:download')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MarketplaceContractTermsModalForStorybook = marketplaceCssHoc()(
  MarketplaceContractTermsModal,
);

export default MarketplaceContractTermsModal;
