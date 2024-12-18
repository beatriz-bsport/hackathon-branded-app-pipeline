import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { downloadDocument } from '#src/utils/downloader';
import CircularProgress from '#src/components/css-only/CircularProgress';

import Button, { ButtonColor } from '#src/components/css-only/Fabrique/Button';
import { useDialogClickAwayListener } from '../../../../../hooks/useDialogClickAwayListener';
import { OptionCallback } from '../../../../../state/types';

import './styles.css';

export type Props = {
  contractTerms: string;
  isOpen: boolean;
  isContractTermsDownloadLoading?: boolean;
  contractTermsLink?: string;
  onDialogClose: () => void;
  onDownloadTerms: (options?: OptionCallback) => void;
};

const MarketplaceContractTermsModal: React.FC<Props> = ({
  contractTerms,
  isOpen,
  contractTermsLink,
  isContractTermsDownloadLoading,
  onDialogClose,
  onDownloadTerms,
}) => {
  const { t } = useTranslation('common');

  const { dialogRef, modalRef } = useDialogClickAwayListener({
    onDialogClose,
  });

  const handleDownloadTerms = useCallback(() => {
    if (contractTermsLink) {
      downloadDocument(contractTermsLink);
      onDialogClose();
    } else {
      onDownloadTerms({
        onSuccess: () => {
          onDialogClose();
        },
      });
    }
  }, [onDialogClose, onDownloadTerms, contractTermsLink]);

  return (
    <>
      {isOpen && (
        <div ref={dialogRef} className="bs-contract-terms-dialog__backdrop">
          <div ref={modalRef} className="bs-contract-terms-dialog__container">
            <p className="bs-contract-terms-dialog__text">{contractTerms}</p>

            <div className="bs-contract-terms-dialog__actions">
              <Button
                classes={{
                  root: 'bs-contract-terms-dialog__button bs-contract-terms-dialog__cancel',
                }}
                onClick={onDialogClose}
              >
                {t('common:close')}
              </Button>
              <Button
                classes={{
                  root: classNames('bs-contract-terms-dialog__button', {
                    'bs-contract-terms-dialog__download--disabled':
                      isContractTermsDownloadLoading,
                    'bs-contract-terms-dialog__download':
                      !isContractTermsDownloadLoading,
                  }),
                }}
                color={ButtonColor.PRIMARY}
                isDisabled={isContractTermsDownloadLoading}
                onClick={handleDownloadTerms}
              >
                {t('common:download')}
                {isContractTermsDownloadLoading && (
                  <CircularProgress size="xs" />
                )}
              </Button>
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

export default React.memo(MarketplaceContractTermsModal);
