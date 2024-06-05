import React from 'react';
import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import Typography from '#Fabrique/Typography';

import '../../styles.css';

type Props = {
  amount: string;
};

const ConsumerInvoiceRefund: React.FC<Props> = ({ amount }) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <div className="bs-consumer-invoice-details-card__body__refund-section">
      <Typography
        className="bs-consumer-invoice-details-card__body__refund-section-label"
        variant="body-lg"
      >
        {t('reworked.myInvoices.detailsCard.refunded')}
      </Typography>
      <Typography
        className="bs-consumer-invoice-details-card__body__refund-section-price"
        variant="body-md"
      >
        {`+${getCurrencyDisplayWithPrice(amount)}`}
      </Typography>
    </div>
  );
};

export default React.memo(ConsumerInvoiceRefund);
