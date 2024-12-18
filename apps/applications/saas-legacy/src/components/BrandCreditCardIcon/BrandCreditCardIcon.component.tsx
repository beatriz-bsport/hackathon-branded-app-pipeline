import React from 'react';

import { CreditCard01 } from '#src/components/untitledui';
import PaymentMethodIcon from '#src/components/PaymentMethodIcon';

import {
  getPaymentMethodPng,
  getPaymentMethodBrandName,
} from '#src/libs/payment/utils';

import '#src/components/BrandCreditCardIcon/styles.css';

export const DefaultCardIcon = React.memo(() => (
  <div className="bs-payment-method-icon__container">
    <CreditCard01 />
  </div>
));

type BrandCreditCardIconProps = {
  brandName: string;
  defaultBrandName: string;
};

export const BrandCreditCardIcon: React.FC<BrandCreditCardIconProps> =
  React.memo(({ brandName, defaultBrandName }) => {
    const imageSrc = getPaymentMethodPng(brandName);
    const methodBrandName = getPaymentMethodBrandName(
      brandName,
      defaultBrandName,
    );

    if (imageSrc && brandName) {
      return <PaymentMethodIcon alt={methodBrandName} src={imageSrc} />;
    }
    return <DefaultCardIcon />;
  });
