import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '#src/components/css-only/Select';
import { SelectOptionWithMetaData } from '#src/components/css-only/Select/Select.component';
import { usePaymentMethodBillingDetails } from '#src/libs/marketplace/hooks';
import { MarketplacePaymentMethodBillingDetails } from '#src/libs/marketplace/types';
import {
  CountryMetaData,
  CountryOption,
} from './MarketplaceCollectPaymentMethod.component';

import './styles.css';

type Props = {
  billingDetails: MarketplacePaymentMethodBillingDetails;
  disabled: boolean;
  setBillingDetails: React.Dispatch<
    React.SetStateAction<MarketplacePaymentMethodBillingDetails>
  >;
  countryOptions: {
    label: string;
    value: string;
    metaData: {
      locale: string;
      icon: string;
    };
  }[];
};

const MarketplaceCardBillingDetailsFormFields = ({
  billingDetails,
  disabled,
  setBillingDetails,
  countryOptions,
}: Props) => {
  const { t } = useTranslation(['invoice']);
  const {
    handleChangeName,
    handleChangeEmail,
    handleChangeLineOne,
    handleChangeLineTwo,
    handleChangePostalCode,
    handleChangeCity,
    handleChangeCountry,
    handleChangeState,
  } = usePaymentMethodBillingDetails(setBillingDetails);

  return (
    <div className="bs-collect-payment-method__mandate__fields__container">
      <Select
        fullWidth
        classes={{ buttonContainer: 'bs-select__button__square' }}
        onChange={handleChangeCountry}
        options={countryOptions}
        placeholder={`${t('translation:form.address.country')}\u00A0*`}
        renderListItem={(option: SelectOptionWithMetaData<CountryMetaData>) => (
          <CountryOption option={option} />
        )}
        value={billingDetails?.address.country || ''}
      />
      <input
        required
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeName}
        placeholder={`${t('invoice:mandate.name')}\u00A0*`}
        value={billingDetails?.name || ''}
      />
      <input
        required
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeLineOne}
        placeholder={`${t('invoice:mandate.address_line_1')}\u00A0*`}
        value={billingDetails?.address.line1 || ''}
      />
      <input
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeLineTwo}
        placeholder={t('invoice:mandate.address_line_2')}
        value={billingDetails?.address.line2 || ''}
      />
      <input
        required
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangePostalCode}
        placeholder={`${t('invoice:mandate.address_postal_code')}\u00A0*`}
        value={billingDetails?.address.postal_code || ''}
      />
      <input
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeState}
        placeholder={t('invoice:mandate.state')}
        value={billingDetails?.address.state || ''}
      />
      <input
        required
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeCity}
        placeholder={`${t('invoice:mandate.city')}\u00A0*`}
        value={billingDetails?.address.city || ''}
      />
      <input
        className="bs-collect-payment-method__mandate__field"
        disabled={disabled}
        onChange={handleChangeEmail}
        placeholder={t('invoice:mandate.email')}
        type="email"
        value={billingDetails?.email || ''}
      />
    </div>
  );
};

export default memo(MarketplaceCardBillingDetailsFormFields);
