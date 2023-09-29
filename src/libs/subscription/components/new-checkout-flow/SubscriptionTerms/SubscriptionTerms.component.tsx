import React, { useCallback, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import classNames from 'classnames';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Checkbox from '#components/css-only/Checkbox/';
import useIsTextExpandable from '../../../../../hooks/useIsTextExpandable';
import Collapse from '#components/css-only/Fabrique/Collapse';

import Button from '#components/css-only/Fabrique/Button';
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
        <Collapse collapsedHeight={72} isExpanded={isTextExpanded}>
          <div
            ref={contractTermsText.ref}
            className={classNames('bs-subscription-terms__text-content', {
              '--shrinked': !isTextExpanded,
              '--gradient': contractTermsText.isExpandable && !isTextExpanded,
              '--expanded': isTextExpanded,
            })}
          >
            {contractTerms}
          </div>
        </Collapse>

        {contractTermsText.isExpandable && (
          <Button
            classes={{ root: 'bs-subcription-terms--text-button' }}
            onClick={handleShowMoreDescription}
          >
            <>
              <KeyboardArrowDownIcon
                className={classNames('bs-subscription-terms__arrow', {
                  'bs-subscription-terms__arrow--rotate': isTextExpanded,
                })}
              />
              {isTextExpanded
                ? t('newCheckout.terms.seeLess')
                : t('newCheckout.terms.seeMore')}
            </>
          </Button>
        )}
      </div>
      <div className="bs-subscription-terms-accept-container">
        <Checkbox
          classes={{
            label: 'bs-subscription-terms__accept-label',
            text: 'bs-subscription-terms__accept-text',
          }}
          isChecked={isContractLegalTermsAccepted}
          label={
            <Trans
              components={[
                <Button
                  classes={{
                    root: 'bs-subscription-terms__accept__label__button',
                    text: 'bs-subscription-terms__accept__label__button--text',
                  }}
                  onClick={onOpenContractTermsDialog}
                >
                  .
                </Button>,
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
