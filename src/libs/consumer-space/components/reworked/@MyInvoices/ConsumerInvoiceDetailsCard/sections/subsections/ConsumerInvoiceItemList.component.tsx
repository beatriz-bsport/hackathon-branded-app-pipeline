import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '#Fabrique/Typography';

import type { InvoiceItem } from '#src/libs/invoice/invoice-item/types';
import { ConsumerInvoiceItem } from '.';

import '../../styles.css';

type Props = {
  invoiceItems: InvoiceItem[];
};

const ConsumerInvoiceItemList: React.FC<Props> = ({ invoiceItems }) => {
  const { t } = useTranslation('consumerSpace');

  const sortedInvoiceItems = [...(invoiceItems || [])].sort(
    (a, b) => parseFloat(b.price) - parseFloat(a.price),
  );

  return (
    <div className="bs-consumer-invoice-details-card__body__items">
      <Typography
        className="bs-consumer-invoice-details-card__body__items-title"
        variant="body-lg"
      >
        {t('reworked.myInvoices.detailsCard.products')}
      </Typography>
      {sortedInvoiceItems.map((invoiceItem: InvoiceItem) => (
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
