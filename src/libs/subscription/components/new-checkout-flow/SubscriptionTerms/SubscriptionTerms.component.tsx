import React, { useCallback, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import classNames from 'classnames';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Checkbox from '#components/css-only/Checkbox/';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';

import './SubscriptionTermsStyles.css';

export type Props = {
  contractTerms: string;
  isContractLegalTermsAccepted: boolean;
  handleAcceptContract: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenContractTermsDialog: () => void;
};

export const SubscriptionTerms: React.FC<Props> = (props) => {
  const {
    contractTerms,
    isContractLegalTermsAccepted,
    handleAcceptContract,
    onOpenContractTermsDialog,
  } = props;
  const { t } = useTranslation('subscription');

  const [isTextExpanded, setIsTexExpanded] = useState(false);
  const contractTermsText = useIsTextExpandable(isTextExpanded);

  const handleShowMoreDescription = useCallback(
    () => setIsTexExpanded((previousShowMore) => !previousShowMore),
    [],
  );

  if (!contractTerms) return null;

  return (
    <div className="bs-subscription-terms__container">
      <div className="bs-subscription-terms__title">
        {t('newCheckout.terms.title')}
      </div>
      <div className="bs-subscription-terms__collapsible-section">
        <div
          ref={contractTermsText.ref}
          className={classNames('bs-subscription-terms__text-content', {
            '--shrinked': !isTextExpanded,
            '--expanded': isTextExpanded,
          })}
        >
          {contractTerms}
        </div>
        {contractTermsText.isExpandable && (
          <button
            className="bs-subcription-terms--text-button"
            onClick={handleShowMoreDescription}
            type="button"
          >
            {isTextExpanded ? (
              <>
                <KeyboardArrowUpIcon />
                {t('newCheckout.terms.seeLess')}
              </>
            ) : (
              <>
                <KeyboardArrowDownIcon />
                {t('newCheckout.terms.seeMore')}
              </>
            )}
          </button>
        )}
      </div>
      <div className="bs-subscription-terms-accept-container">
        <Checkbox
          classes={{ label: 'bs-subscription-terms__accept-label' }}
          isChecked={isContractLegalTermsAccepted}
          label={
            <Trans
              components={[
                <button
                  className="bs-subscription-terms__accept__label__button"
                  onClick={onOpenContractTermsDialog}
                  type="button"
                >
                  .
                </button>,
              ]}
              i18nKey="newCheckout.terms.acceptTerms"
              t={t}
            />
          }
          name="terms-approval"
          onChange={handleAcceptContract}
        />
      </div>
    </div>
  );
};

export const SubscriptionTermsForStorybook =
  marketplaceCssHoc()(SubscriptionTerms);

export default SubscriptionTerms;
