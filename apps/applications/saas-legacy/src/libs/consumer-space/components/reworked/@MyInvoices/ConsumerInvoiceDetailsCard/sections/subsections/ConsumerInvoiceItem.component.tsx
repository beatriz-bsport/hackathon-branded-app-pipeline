import React from 'react';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Typography from '#Fabrique/Typography';
import classNames from 'classnames';

import '../../styles.css';

type Props = {
  name: string;
  price: string;
  priceBeforeDiscount: string;
  subtitle?: string; // We need subtitle for certain objects, consumer giftcards for example
};

const ConsumerInvoiceItem: React.FC<Props> = ({
  name,
  price,
  priceBeforeDiscount,
  subtitle,
}) => {
  return (
    <div className="bs-consumer-invoice-details-card__body__invoice-item">
      <div className="bs-consumer-invoice-details-card__body__invoice-item-identifier">
        <Typography
          className="bs-consumer-invoice-details-card__body__invoice-item-name"
          variant="body-sm"
        >
          {name}
        </Typography>
        <Typography
          className={classNames(
            'bs-consumer-invoice-details-card__body__invoice-item-subtitle',
            {
              'bs-consumer-invoice-details-card__body__invoice-item-subtitle--hidden':
                !subtitle,
            },
          )}
          variant="body-xs"
        >
          {subtitle}
        </Typography>
      </div>
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
