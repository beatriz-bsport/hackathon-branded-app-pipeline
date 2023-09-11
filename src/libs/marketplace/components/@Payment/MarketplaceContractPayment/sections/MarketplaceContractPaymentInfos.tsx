import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Checkbox from '#components/css-only/Checkbox/';
import MarketplaceDatePicker from '#marketplacecomponents/@Date/MarketplaceDatePicker';

import '../styles.css';

export type Props = {
  contractName: string;
  isContractLegalTermsAccepted: boolean;
  billingStartDate: string;
  setBillingStartDate: (value: string) => void;
  handleAcceptContract: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenContractTermsDialog: () => void;
};

const MarketplaceContractPaymentInfos: React.FC<Props> = React.memo(
  ({
    contractName,
    isContractLegalTermsAccepted,
    billingStartDate,
    setBillingStartDate,
    handleAcceptContract,
    onOpenContractTermsDialog,
  }) => {
    const { t } = useTranslation('subscription');

    return (
      <div className="bs-contract-payment__general_conditions">
        <h6 className="bs-contract-payment__general_conditions__title">
          {contractName}
        </h6>

        <Checkbox
          classes={{ label: 'bs-contract-payment__contract__terms__label' }}
          isChecked={isContractLegalTermsAccepted}
          label={
            <Trans
              components={[
                <button
                  className="bs-contract-payment__contract__terms"
                  onClick={onOpenContractTermsDialog}
                  type="button"
                >
                  .
                </button>,
              ]}
              i18nKey="subscription:contract.actions.iAcceptContractTerms"
              t={t}
            />
          }
          name="terms-approval"
          onChange={handleAcceptContract}
        />

        <div className="bs-contract-payment__start">
          {t('subscription:contract.actions.iwanttostarton')}
          <div className="bs-contract-payment__datepicker__container">
            <MarketplaceDatePicker
              disablePast
              isInputButton
              dateSelected={billingStartDate}
              onSelect={setBillingStartDate}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const MarketplaceContractPaymentInfosForStorybook = marketplaceCssHoc()(
  MarketplaceContractPaymentInfos,
);

export default MarketplaceContractPaymentInfos;
