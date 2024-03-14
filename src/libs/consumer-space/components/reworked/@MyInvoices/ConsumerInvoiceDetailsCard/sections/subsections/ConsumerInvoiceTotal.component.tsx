import React from 'react';
import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Typography from '#Fabrique/Typography';

import '../../styles.css';

type Props = {
  total: string;
  paid: string;
  due: string | null;
};

const ConsumerInvoiceTotal: React.FC<Props> = ({ total, paid, due }) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <div className="bs-consumer-invoice-details-card__body__total-section">
      <div className="bs-consumer-invoice-details-card__body__total-section__total">
        <Typography
          className="bs-consumer-invoice-details-card__body__total-section__total-label"
          variant="body-lg"
        >
          {t('reworked.myInvoices.detailsCard.total')}
        </Typography>
        <Typography
          className="bs-consumer-invoice-details-card__body__total-section__total-price"
          variant="body-lg"
        >
          {getCurrencyDisplayWithPrice(total)}
        </Typography>
      </div>
      <div className="bs-consumer-invoice-details-card__body__total-section__paid">
        <Typography
          className="bs-consumer-invoice-details-card__body__total-section__paid-label"
          variant="body-sm"
        >
          {t('reworked.myInvoices.detailsCard.paid')}
        </Typography>
        <Typography
          className="bs-consumer-invoice-details-card__body__total-section__paid-price"
          variant="body-sm"
        >
          {getCurrencyDisplayWithPrice(paid)}
        </Typography>
      </div>
      {!!due && parseInt(due ?? '0', 10) !== 0 && (
        <div className="bs-consumer-invoice-details-card__body__total-section__due">
          <Typography
            className="bs-consumer-invoice-details-card__body__total-section__due-label"
            variant="body-sm"
          >
            {t('reworked.myInvoices.detailsCard.due')}
          </Typography>
          <Typography
            className="bs-consumer-invoice-details-card__body__total-section__due-price"
            variant="body-sm"
          >
            {getCurrencyDisplayWithPrice(due)}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default React.memo(ConsumerInvoiceTotal);
