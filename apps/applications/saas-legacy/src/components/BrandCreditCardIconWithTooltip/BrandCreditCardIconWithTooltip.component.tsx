import React, { useMemo } from 'react';

import Tooltip from '#src/components/css-only/Fabrique/Tooltipv2';
import BrandCreditCardIcon from '#src/components/BrandCreditCardIcon';

import { getPaymentMethodBrandName } from '#src/libs/payment/utils';

import '#src/components/BrandCreditCardIconWithTooltip/styles.css';

type BrandCreditCardIconWithTooltipProps = {
  brandName: string;
  isCobrandedCard: boolean;
  defaultBrandName: string;
  tooltipDetailText: string;
};

const BrandCreditCardIconWithTooltip: React.FC<
  BrandCreditCardIconWithTooltipProps
> = ({ brandName, isCobrandedCard, defaultBrandName, tooltipDetailText }) => {
  // Define the tooltip text
  const tooltipDetails = useMemo(() => {
    return isCobrandedCard ? ' - ' + tooltipDetailText : null;
  }, [isCobrandedCard, tooltipDetailText]);

  const methodBrandName = useMemo(() => {
    return getPaymentMethodBrandName(brandName, defaultBrandName);
  }, [brandName, defaultBrandName]);

  return (
    <Tooltip
      text={
        <div className="bs-payment-method-icon__tooltip__text">
          {methodBrandName && <strong>{methodBrandName}</strong>}
          {tooltipDetails && <span>{tooltipDetails}</span>}
        </div>
      }
    >
      <div className="bs-payment-method-icon__brand">
        <BrandCreditCardIcon
          brandName={brandName}
          defaultBrandName={defaultBrandName}
        />
      </div>
    </Tooltip>
  );
};

export default React.memo(BrandCreditCardIconWithTooltip);
