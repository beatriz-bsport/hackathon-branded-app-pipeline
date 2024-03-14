import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConsumerInvoiceItem } from '.';
import Typography from '#Fabrique/Typography';

import type { InvoiceItem } from '#libs/invoice/invoice-item/types';

import '../../styles.css';

type Props = {
  invoiceItems: InvoiceItem[];
};

const ConsumerInvoiceItemList: React.FC<Props> = ({ invoiceItems }) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <div className="bs-consumer-invoice-details-card__body__items">
      <Typography
        className="bs-consumer-invoice-details-card__body__items-title"
        variant="body-lg"
      >
        {t('reworked.myInvoices.detailsCard.products')}
      </Typography>
      {(invoiceItems || []).map((invoiceItem: InvoiceItem) => (
        <ConsumerInvoiceItem
          key={`ConsumerInvoiceDetailsCard-invoiceItem:${invoiceItem.id}`}
          name={invoiceItem.name}
          price={invoiceItem.total_price}
          priceBeforeDiscount={invoiceItem.price}
        />
      ))}
    </div>
  );
};

export default React.memo(ConsumerInvoiceItemList);
