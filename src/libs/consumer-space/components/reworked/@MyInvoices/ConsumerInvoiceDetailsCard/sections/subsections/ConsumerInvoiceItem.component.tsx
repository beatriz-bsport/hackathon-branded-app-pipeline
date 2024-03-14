import React from 'react';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Typography from '#Fabrique/Typography';

import '../../styles.css';

type Props = {
  name: string;
  price: string;
  priceBeforeDiscount: string;
};

const ConsumerInvoiceItem: React.FC<Props> = ({
  name,
  price,
  priceBeforeDiscount,
}) => {
  return (
    <div className="bs-consumer-invoice-details-card__body__invoice-item">
      <Typography
        className="bs-consumer-invoice-details-card__body__invoice-item-name"
        variant="body-sm"
      >
        {name}
      </Typography>
      <div className="bs-consumer-invoice-details-card__body__invoice-item-price">
        {price !== priceBeforeDiscount && (
          <Typography
            className="bs-consumer-invoice-details-card__body__invoice-item-price__before-discount"
            variant="body-xs"
          >
            {getCurrencyDisplayWithPrice(priceBeforeDiscount)}
          </Typography>
        )}
        <Typography
          className="bs-consumer-invoice-details-card__body__invoice-item-price__total-price"
          variant="body-md"
        >
          {getCurrencyDisplayWithPrice(price)}
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(ConsumerInvoiceItem);
